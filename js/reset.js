// ======================================================
// Helpers LocalStorage
// ======================================================
function getLS(key) {
  try { return JSON.parse(localStorage.getItem(key)) || []; }
  catch { return []; }
}
function setLS(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}
function clearLS(keys) {
  keys.forEach(k => localStorage.removeItem(k));
}

// ======================================================
// Botón de reinicio
// ======================================================
const resetBtn = document.getElementById('resetBtn');

if (resetBtn) {
  resetBtn.addEventListener('click', () => {
    // 🔄 Claves que queremos limpiar
    const keysToClear = [
      'ingresos',
      'gastos',
      'ingresosEfectivo',
      'serviciosCount',
      'totalesIngresos'
    ];

    clearLS(keysToClear);

    // Mensaje visual de confirmación
    alert('✅ Estadísticas y registros reiniciados correctamente.');

    // Opcional: redirigir al dashboard
    window.location.href = 'dashboard.html';
  });
}

// ======================================================
// Banner navegación (igual que en otros módulos)
// ======================================================
const bannerTitle = document.getElementById('bannerTitle');
const logoutBtn = document.getElementById('logoutBtn');
if (bannerTitle) bannerTitle.addEventListener('click', () => (window.location.href = 'dashboard.html'));
if (logoutBtn) logoutBtn.addEventListener('click', () => (window.location.href = 'index.html'));

// Menú lateral opcional
const menuBtn = document.getElementById('menuBtn');
const sideMenu = document.getElementById('sideMenu');
const closeBtn = document.getElementById('closeBtn');
const overlay = document.getElementById('overlay');
function openMenu() { if (sideMenu && overlay) { sideMenu.style.left = '0'; overlay.style.display = 'block'; } }
function closeMenu() { if (sideMenu && overlay) { sideMenu.style.left = '-250px'; overlay.style.display = 'none'; } }
if (menuBtn && closeBtn && overlay && sideMenu) {
  menuBtn.addEventListener('click', openMenu);
  closeBtn.addEventListener('click', closeMenu);
  overlay.addEventListener('click', closeMenu);
}
