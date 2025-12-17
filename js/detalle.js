// ======================================================
// Helpers LocalStorage
// ======================================================
function getLS(key) {
  try { return JSON.parse(localStorage.getItem(key)) || []; }
  catch { return []; }
}

// ======================================================
// Obtener parámetro tipo de la URL
// ======================================================
function getTipo() {
  const params = new URLSearchParams(window.location.search);
  return params.get('tipo') || 'Corte';
}

// ======================================================
// Elementos del DOM
// ======================================================
const detalleTitulo = document.getElementById('detalleTitulo');
const totalRealizados = document.getElementById('totalRealizados');
const countNinos = document.getElementById('countNinos');
const countAdultos = document.getElementById('countAdultos');
const countMayores = document.getElementById('countMayores');
const ingresoBs = document.getElementById('ingresoBs');
const ingresoUsd = document.getElementById('ingresoUsd');
const ingresoCop = document.getElementById('ingresoCop');

// ======================================================
// Actualizar estadísticas
// ======================================================
function actualizarDetalle() {
  const tipo = getTipo();
  detalleTitulo.textContent = `📊 Estadísticas de ${tipo}`;

  const ingresos = getLS('ingresos'); // [{servicios, edad, costo, moneda}]
  const ingresosEfectivo = getLS('ingresosEfectivo'); // no se usa aquí

  let total = 0;
  let edades = { Niño: 0, Adulto: 0, Mayor: 0 };
  let ingresosPorMoneda = { Bs: 0, $: 0, COP: 0 };

  ingresos.forEach(i => {
    if (i.servicios && i.servicios.includes(tipo)) {
      total++;
      if (i.edad && edades[i.edad] !== undefined) {
        edades[i.edad]++;
      }
      if (i.moneda && ingresosPorMoneda[i.moneda] !== undefined) {
        ingresosPorMoneda[i.moneda] += Number(i.costo);
      }
    }
  });

  // Actualizar DOM
  totalRealizados.textContent = total;
  countNinos.textContent = edades['Niño'];
  countAdultos.textContent = edades['Adulto'];
  countMayores.textContent = edades['Mayor'];

  ingresoBs.textContent = ingresosPorMoneda['Bs'] > 0 ? ingresosPorMoneda['Bs'].toFixed(2) : '—';
  ingresoUsd.textContent = ingresosPorMoneda['$'] > 0 ? ingresosPorMoneda['$'].toFixed(2) : '—';
  ingresoCop.textContent = ingresosPorMoneda['COP'] > 0 ? ingresosPorMoneda['COP'].toFixed(2) : '—';
}

// ======================================================
// Inicializar
// ======================================================
actualizarDetalle();

// ======================================================
// Banner navegación
// ======================================================
const bannerTitle = document.getElementById('bannerTitle');
const logoutBtn = document.getElementById('logoutBtn');
if (bannerTitle) bannerTitle.addEventListener('click', () => (window.location.href = 'dashboard.html'));
if (logoutBtn) logoutBtn.addEventListener('click', () => (window.location.href = 'index.html'));

// ======================================================
// Menú lateral
// ======================================================
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
