// ======================================================
// Helpers de mensajes elegantes
// ======================================================
function crearMensaje(targetForm, texto, tipo = 'info') {
  const palette = {
    error: { text: '#dc3545', bg: '#f8d7da', border: '#dc3545' },
    success: { text: '#28a745', bg: '#d4edda', border: '#28a745' },
    info: { text: '#0c5460', bg: '#d1ecf1', border: '#0c5460' }
  };
  const c = palette[tipo] || palette.info;

  const msg = document.createElement('p');
  msg.textContent = texto;
  msg.style.color = c.text;
  msg.style.background = c.bg;
  msg.style.border = `1px solid ${c.border}`;
  msg.style.padding = '10px';
  msg.style.borderRadius = '8px';
  msg.style.textAlign = 'center';
  msg.style.marginTop = '12px';
  msg.style.fontWeight = '600';
  msg.style.whiteSpace = 'pre-line';
  targetForm.appendChild(msg);
  setTimeout(() => msg.remove(), 4000);
}

// ======================================================
// Acceso al DOM
// ======================================================
const cardServicio = document.getElementById('cardServicio');
const cardEfectivo = document.getElementById('cardEfectivo');
const formServicio = document.getElementById('formServicio');
const formEfectivo = document.getElementById('formEfectivo');
const servicioBtns = document.querySelectorAll('.servicio-btn');
const edadBtns = document.querySelectorAll('.edad-btn');

// ======================================================
// Mostrar formularios según selección
// ======================================================
cardServicio.addEventListener('click', () => {
  formServicio.classList.remove('hidden');
  formEfectivo.classList.add('hidden');
});
cardEfectivo.addEventListener('click', () => {
  formEfectivo.classList.remove('hidden');
  formServicio.classList.add('hidden');
});

// ======================================================
// Selección múltiple de servicios (Corte, Barba, Tinte)
// ======================================================
servicioBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    btn.classList.toggle('active'); // puede activar varios
  });
});

// ======================================================
// Selección única de edad (Niño, Adulto, Mayor)
// ======================================================
edadBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    edadBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });
});

// ======================================================
// LocalStorage helpers
// ======================================================
function getLS(key) {
  try { return JSON.parse(localStorage.getItem(key)) || []; }
  catch { return []; }
}
function setLS(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

// Actualiza contadores por servicio (Corte, Barba, Tinte)
function actualizarContadoresServicios(serviciosSeleccionados) {
  const counts = getLS('serviciosCount'); // [{tipo, total}]
  const map = counts.reduce((acc, cur) => {
    acc[cur.tipo] = (acc[cur.tipo] || 0) + cur.total;
    return acc;
  }, {});
  serviciosSeleccionados.forEach(s => {
    map[s] = (map[s] || 0) + 1;
  });
  const newCounts = Object.entries(map).map(([tipo, total]) => ({ tipo, total }));
  setLS('serviciosCount', newCounts);
}

// Actualiza totales de ingresos por moneda
function sumarTotalesIngresos(moneda, monto) {
  const totals = getLS('totalesIngresos'); // [{moneda, total}]
  const tmap = totals.reduce((acc, cur) => {
    acc[cur.moneda] = (acc[cur.moneda] || 0) + cur.total;
    return acc;
  }, {});
  tmap[moneda] = (tmap[moneda] || 0) + monto;
  const newTotals = Object.entries(tmap).map(([m, total]) => ({ moneda: m, total }));
  setLS('totalesIngresos', newTotals);
}

// ======================================================
// Submit: formulario Servicio
// ======================================================
formServicio.addEventListener('submit', (e) => {
  e.preventDefault();

  const nombre = document.getElementById('nombre').value.trim();
  const costoStr = document.getElementById('costo').value.trim();
  const moneda = document.getElementById('moneda').value;

  const serviciosSeleccionados = Array.from(document.querySelectorAll('.servicio-btn.active'))
    .map(btn => btn.dataset.servicio); // array de servicios

  const edadBtn = document.querySelector('.edad-btn.active');
  const edad = edadBtn ? edadBtn.dataset.edad : '';

  // Validaciones
  if (!nombre || !costoStr || !moneda) {
    crearMensaje(formServicio, '❌ Completa nombre, costo y moneda.', 'error');
    return;
  }
  if (serviciosSeleccionados.length === 0) {
    crearMensaje(formServicio, '❌ Selecciona al menos un servicio.', 'error');
    return;
  }
  if (!edad) {
    crearMensaje(formServicio, '❌ Selecciona la edad del cliente.', 'error');
    return;
  }

  const costo = parseFloat(costoStr);
  if (isNaN(costo) || costo <= 0) {
    crearMensaje(formServicio, '❌ El costo debe ser mayor a 0.', 'error');
    return;
  }

  // Guardar ingreso individual (historial)
  const ingresos = getLS('ingresos');
  const payload = {
    tipo: 'Servicio',
    cliente: nombre,
    servicios: serviciosSeleccionados, // múltiples
    edad,
    costo,
    moneda,
    fecha: new Date().toISOString()
  };
  ingresos.push(payload);
  setLS('ingresos', ingresos);

  // Actualizar contadores y totales
  actualizarContadoresServicios(serviciosSeleccionados);
  sumarTotalesIngresos(moneda, costo);

  crearMensaje(
    formServicio,
    `✅ Ingreso por servicio registrado:
Cliente: ${payload.cliente}
Servicios: ${payload.servicios.join(', ')} (${payload.edad})
Monto: ${payload.costo} ${payload.moneda}`,
    'success'
  );

  // Limpiar para siguiente registro
  formServicio.reset();
  servicioBtns.forEach(b => b.classList.remove('active'));
  edadBtns.forEach(b => b.classList.remove('active'));
});

// ======================================================
// Submit: formulario Efectivo
// ======================================================
formEfectivo.addEventListener('submit', (e) => {
  e.preventDefault();

  const cantidadStr = document.getElementById('cantidad').value.trim();
  const monedaE = document.getElementById('monedaEfectivo').value;
  const tipo = document.getElementById('tipo').value; // Efectivo | Transferencia
  const concepto = document.getElementById('concepto').value.trim();

  if (!cantidadStr || !monedaE || !tipo) {
    crearMensaje(formEfectivo, '❌ Completa cantidad, moneda y tipo.', 'error');
    return;
  }
  const cantidad = parseFloat(cantidadStr);
  if (isNaN(cantidad) || cantidad <= 0) {
    crearMensaje(formEfectivo, '❌ La cantidad debe ser mayor a 0.', 'error');
    return;
  }
  if (concepto.length > 120) {
    crearMensaje(formEfectivo, '❌ El concepto no puede superar 120 caracteres.', 'error');
    return;
  }

  // Guardar ingreso de efectivo (historial)
  const ingresosEfectivo = getLS('ingresosEfectivo');
  const payload = {
    tipo: 'IngresoEfectivo',
    cantidad,
    moneda: monedaE,
    pago: tipo,
    concepto,
    fecha: new Date().toISOString()
  };
  ingresosEfectivo.push(payload);
  setLS('ingresosEfectivo', ingresosEfectivo);

  // Actualizar totales de ingresos por moneda
  sumarTotalesIngresos(monedaE, cantidad);

  crearMensaje(
    formEfectivo,
    `✅ Ingreso de efectivo registrado:
Cantidad: ${payload.cantidad} ${payload.moneda}
Tipo: ${payload.pago}
Concepto: ${payload.concepto || '—'}`,
    'success'
  );

  formEfectivo.reset();
});

// ======================================================
// Banner navegación (si usas el mismo header)
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
