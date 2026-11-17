"""Подготвя само представителния сайт за Cloudflare Pages.

Изпълнение от основната папка: python scripts/prepare-public.py
Прототипите в dist остават за локална работа и не влизат в архива.
"""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import unquote
import re
import zipfile

root = Path(__file__).resolve().parents[1]
source = root / 'dist'
output = root / 'outputs'
output.mkdir(exist_ok=True)
pages = ['index.html', 'teachers.html', 'schedule.html', 'gallery.html']
files = {}
for name in pages:
    text = (source / name).read_text(encoding='utf-8')
    text = text.replace('href="registration.html"', 'href="index.html#contact"')
    text = re.sub(r'<a\b[^>]*href="privacy-draft\.html"[^>]*>.*?</a>', '', text, flags=re.S)
    # В началната страница вече няма фотогалерия или нужда от диалога.
    if name == 'index.html':
        text = re.sub(r'<dialog id="photo-dialog".*?</dialog>', '', text, flags=re.S)
        text = text.replace('<script src="gallery.js" defer></script>', '')
    files[name] = text.encode('utf-8')

for name in ['styles.css', 'script.js', 'gallery.js']:
    files[name] = (source / name).read_bytes()
for asset in (source / 'assets').glob('*'):
    if asset.is_file():
        files['assets/' + asset.name] = asset.read_bytes()

files['_headers'] = b'/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n  Permissions-Policy: camera=(), microphone=(), geolocation=()\n  Content-Security-Policy: default-src \'self\'; script-src \'self\'; style-src \'self\'; img-src \'self\'; connect-src \'none\'; object-src \'none\'; base-uri \'self\'; form-action \'none\'; frame-ancestors \'none\'\n'

class Validate(HTMLParser):
    def handle_starttag(self, tag, attrs):
        for key, value in attrs:
            if key not in ['src', 'href'] or not value or value.startswith(('#', 'https:', 'http:', 'tel:', 'mailto:')):
                continue
            target = unquote(value.split('#')[0].split('?')[0])
            assert target in files, f'Missing local target: {target}'

for name in pages:
    text = files[name].decode('utf-8')
    Validate().feed(text)
    assert 'registration.html' not in text and 'registry-demo.html' not in text
    assert 'privacy-draft.html' not in text

archive = output / 'tiniti-public.zip'
with zipfile.ZipFile(archive, 'w', compression=zipfile.ZIP_DEFLATED) as bundle:
    for name, data in files.items():
        bundle.writestr(name, data)
print(f'Ready: {archive}\n{len(files)} files; demo pages excluded; local links checked.')
