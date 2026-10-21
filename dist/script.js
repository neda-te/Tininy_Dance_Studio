// Мобилното меню и състоянието му за екранните четци.
const button = document.querySelector('#toggle');
const nav = document.querySelector('#nav');
function closeMenu() {
  nav.classList.remove('open');
  button.setAttribute('aria-expanded', 'false');
}
button.addEventListener('click', () => {
  button.setAttribute('aria-expanded', String(nav.classList.toggle('open')));
});
nav.addEventListener('click', event => {
  if (event.target.closest('a')) closeMenu();
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && nav.classList.contains('open')) {
    closeMenu();
    button.focus();
  }
});
window.matchMedia('(min-width:721px)').addEventListener('change', closeMenu);
