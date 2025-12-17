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

// ======================================================
// Toggle panel de tasas
// ======================================================
const toggleTasas = document.getElementById('toggleTasas');
const cambioSection = document.getElementById('cambioSection');

if (toggleTasas && cambioSection) {
  toggleTasas.addEventListener('click', () => {
    cambioSection.classList.toggle('hidden');
  });
}

// ======================================================
// Guardar configuración de tasas
// ======================================================
const formTasas = document.getElementById('formTasas');
if (formTasas) {
  formTasas.addEventListener('submit', (e) => {
    e.preventDefault();
    const copUsd = parseFloat(document.getElementById('copUsd').value.trim());
    const bsUsd = parseFloat(document.getElementById('bsUsd').value.trim());
    const destino = document.getElementById('destino').value;

    const tasas = {
      copUsd: isNaN(copUsd) ? null : copUsd,
      bsUsd: isNaN(bsUsd) ? null : bsUsd,
      destino
    };
    setLS('tasasCambio', tasas);

    actualizarDashboard();
  });
}

// ======================================================
// Elementos de tarjetas
// ======================================================
const countServicios = document.getElementById('countServicios');
const totalIngresos = document.getElementById('totalIngresos');
const totalGastos = document.getElementById('totalGastos');
const totalGanancias = document.getElementById('totalGanancias');

// ======================================================
// Actualizar servicios (unificados en "Servicios")
// ======================================================
function actualizarServicios() {
  const counts = getLS('serviciosCount'); // [{tipo, total}]
  const total = counts.reduce((acc, cur) => acc + cur.total, 0);
  if (countServicios) countServicios.textContent = total || 0;
}

// ======================================================
// Conversión de montos según tasas
// ======================================================
function convertirMonto(monto, monedaOrigen, tasas) {
  if (!tasas || !tasas.destino) return null;
  const destino = tasas.destino;

  // Si origen y destino son iguales → no convertir
  if (monedaOrigen === destino) return monto;

  // Convertir primero a USD como base
  let montoUsd = null;
  if (monedaOrigen === '$') montoUsd = monto;
  else if (monedaOrigen === 'COP' && tasas.copUsd) montoUsd = monto / tasas.copUsd;
  else if (monedaOrigen === 'Bs' && tasas.bsUsd) montoUsd = monto / tasas.bsUsd;

  if (montoUsd === null) return null;

  // De USD a destino
  if (destino === '$') return montoUsd;
  if (destino === 'COP' && tasas.copUsd) return montoUsd * tasas.copUsd;
  if (destino === 'Bs' && tasas.bsUsd) return montoUsd * tasas.bsUsd;

  return null;
}

// ======================================================
// Actualizar Ingresos, Gastos y Ganancias
// ======================================================
function actualizarFinanzas() {
  const tasas = getLS('tasasCambio');
  const ingresos = getLS('ingresos'); // [{costo, moneda}]
  const ingresosEfectivo = getLS('ingresosEfectivo'); // [{cantidad, moneda}]
  const gastos = getLS('gastos'); // [{cantidad, moneda}]

  let sumaIngresos = 0;
  ingresos.forEach(i => {
    const convertido = convertirMonto(i.costo, i.moneda, tasas);
    if (convertido !== null) sumaIngresos += convertido;
  });
  ingresosEfectivo.forEach(i => {
    const convertido = convertirMonto(i.cantidad, i.moneda, tasas);
    if (convertido !== null) sumaIngresos += convertido;
  });

  let sumaGastos = 0;
  gastos.forEach(g => {
    const convertido = convertirMonto(g.cantidad, g.moneda, tasas);
    if (convertido !== null) sumaGastos += convertido;
  });

  const sumaGanancias = sumaIngresos - sumaGastos;

  totalIngresos.textContent = sumaIngresos > 0 ? sumaIngresos.toFixed(2) + ' ' + (tasas.destino || '') : '—';
  totalGastos.textContent = sumaGastos > 0 ? sumaGastos.toFixed(2) + ' ' + (tasas.destino || '') : '—';
  totalGanancias.textContent = sumaGanancias !== 0 ? sumaGanancias.toFixed(2) + ' ' + (tasas.destino || '') : '—';
}

// ======================================================
// Actualizar dashboard completo
// ======================================================
function actualizarDashboard() {
  actualizarServicios();
  actualizarFinanzas();
}

// ======================================================
// Inicializar
// ======================================================
actualizarDashboard();

// ======================================================
// Navegación footer
// ======================================================
const btnIngreso = document.getElementById('btnIngreso');
const btnGasto = document.getElementById('btnGasto');
if (btnIngreso) btnIngreso.addEventListener('click', () => (window.location.href = 'ingreso.html'));
if (btnGasto) btnGasto.addEventListener('click', () => (window.location.href = 'gasto.html'));

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

function openMenu() { 
  if (sideMenu && overlay) { 
    sideMenu.style.left = '0'; 
    overlay.style.display = 'block'; 
  } 
}
function closeMenu() { 
  if (sideMenu && overlay) { 
    sideMenu.style.left = '-250px'; 
    overlay.style.display = 'none'; 
  } 
}

if (menuBtn && closeBtn && overlay && sideMenu) {
  menuBtn.addEventListener('click', openMenu);
  closeBtn.addEventListener('click', closeMenu);
  overlay.addEventListener('click', closeMenu);
}
