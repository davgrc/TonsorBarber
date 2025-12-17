// ======================================================
// Helpers LocalStorage
// ======================================================
function getLS(key) {
  try { return JSON.parse(localStorage.getItem(key)) || []; }
  catch { return []; }
}

// ======================================================
// Detectar tipo desde la URL
// ======================================================
const params = new URLSearchParams(window.location.search);
let tipo = params.get('tipo');
if (tipo) tipo = tipo.toLowerCase(); // normalizamos a minúsculas

const title = document.getElementById('statsTitle');
const list = document.getElementById('statsList');

// ======================================================
// Render según tipo
// ======================================================
if (tipo === 'ingresos') {
  title.textContent = '📈 Detalle de Ingresos';
  const ingresos = getLS('ingresos');
  const ingresosEfectivo = getLS('ingresosEfectivo');

  const allIngresos = [...ingresos, ...ingresosEfectivo];

  list.innerHTML = allIngresos.length > 0
    ? allIngresos.map(i => `
      <div class="detalle-card ingreso">
        <strong>${i.cliente || i.descripcion || 'Ingreso'}</strong>
        <br>Monto: ${i.costo || i.cantidad} ${i.moneda}
        <br>Fecha: ${i.fecha ? new Date(i.fecha).toLocaleString() : '—'}
      </div>
    `).join('')
    : '<p>No hay ingresos registrados.</p>';
}

if (tipo === 'gastos') {
  title.textContent = '📉 Detalle de Gastos';
  const gastos = getLS('gastos');

  list.innerHTML = gastos.length > 0
    ? gastos.map(g => `
      <div class="detalle-card gasto">
        <strong>${g.descripcion}</strong>
        <br>Monto: ${g.cantidad} ${g.moneda}
        <br>Fecha: ${g.fecha ? new Date(g.fecha).toLocaleString() : '—'}
      </div>
    `).join('')
    : '<p>No hay gastos registrados.</p>';
}

if (tipo === 'ganancias') {
  title.textContent = '💰 Detalle de Ganancias';
  const totales = getLS('totalesIngresos');

  list.innerHTML = totales.length > 0
    ? totales.map(t => `
      <div class="detalle-card ganancia">
        <strong>${t.moneda}</strong>
        <br>Total: ${t.total}
      </div>
    `).join('')
    : '<p>No hay ganancias calculadas.</p>';
}

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
