// Navegación banner
if (bannerTitle) {
  bannerTitle.style.cursor = 'pointer'; // hace que se vea clickeable
  bannerTitle.addEventListener('click', () => {
    window.location.href = 'dashboard.html';
  });
}
