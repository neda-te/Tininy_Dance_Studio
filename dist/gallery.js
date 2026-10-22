const photoDialog = document.querySelector('#photo-dialog');
const largePhoto = document.querySelector('#large-photo');
let photoTrigger;
document.querySelectorAll('[data-lightbox]').forEach(link => {
  link.addEventListener('click', event => {
    event.preventDefault();
    photoTrigger = link;
    largePhoto.src = link.href;
    largePhoto.alt = link.querySelector('img').alt;
    document.querySelector('#photo-caption').textContent = largePhoto.alt;
    photoDialog.showModal();
  });
});
document.querySelector('.photo-close').addEventListener('click', () => photoDialog.close());
photoDialog.addEventListener('click', event => { if (event.target === photoDialog) photoDialog.close(); });
photoDialog.addEventListener('close', () => { largePhoto.removeAttribute('src'); photoTrigger?.focus(); });
