// ======================================================
// Mensajes elegantes
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
  Object.assign(msg.style, {
    color: c.text,
    background: c.bg,
    border: `1px solid ${c.border}`,
    padding: '10px',
    borderRadius: '8px',
    textAlign: 'center',
    marginTop: '12px',
    fontWeight: '600',
    whiteSpace: 'pre-line'
  });
  targetForm.appendChild(msg);
  setTimeout(() => msg.remove(), 4000);
}

// ======================================================
// Helpers de LocalStorage
// ======================================================
function getLS(key, fallback = []) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}
function setLS(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

// ======================================================
// DOM
// ======================================================
const cardServicio = document.getElementById('cardServicio');
const cardEfectivo = document.getElementById('cardEfectivo');
const formServicio = document.getElementById('formServicio');
const formEfectivo = document.getElementById('formEfectivo');
const servicioBtns = document.querySelectorAll('.servicio-btn');

// Campos Servicio
const inputNombre = document.getElementById('nombre');
const inputCosto = document.getElementById('costo');
const selectMoneda = document.getElementById('moneda');
const selectBarbero = document.getElementById('barbero');
const inputFechaHoraServicio = document.getElementById('fechaHora');

// Campos Efectivo
const inputCantidad = document.getElementById('cantidad');
const selectMonedaEfectivo = document.getElementById('monedaEfectivo');
const selectTipoPago = document.getElementById('tipo');
const inputConcepto = document.getElementById('concepto');
const inputFechaHoraEfectivo = document.getElementById('fechaHoraEfectivo');

// ======================================================
// Inicializar barberos (desde LS o lista base)
// ======================================================
function initBarberos() {
  const base = ['Carlos', 'Luis', 'Pedro'];
  const barberos = getLS('barberos', base);
  if (selectBarbero) {
    // Limpia y repuebla manteniendo el "Seleccionar barbero"
    const first = document.createElement('option');
    first.value = '';
    first.disabled = true;
    first.selected = true;
    first.textContent = 'Seleccionar barbero';
    selectBarbero.innerHTML = '';
    selectBarbero.appendChild(first);
    barberos.forEach(nombre => {
      const opt = document.createElement('option');
      opt.value = nombre;
      opt.textContent = nombre;
      selectBarbero.appendChild(opt);
    });
  }
}

// ======================================================
// Mostrar formularios
// ======================================================
function showServicio() {
  formServicio.classList.remove('hidden');
  formEfectivo.classList.add('hidden');
  // Sello de fecha/hora (oculto)
  if (inputFechaHoraServicio) inputFechaHoraServicio.value = new Date().toISOString();
}
function showEfectivo() {
  formEfectivo.classList.remove('hidden');
  formServicio.classList.add('hidden');
  // Sello de fecha/hora (oculto)
  if (inputFechaHoraEfectivo) inputFechaHoraEfectivo.value = new Date().toISOString();
}

if (cardServicio) cardServicio.addEventListener('click', showServicio);
if (cardEfectivo) cardEfectivo.addEventListener('click', showEfectivo);

// ======================================================
// Selección múltiple de servicios (Corte, Barba, Tinte)
// ======================================================
servicioBtns.forEach(btn => {
  btn.addEventListener('click', () => btn.classList.toggle('active'));
});

// ======================================================
// Contadores y totales
// ======================================================
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
// Guardado unificado (para filtros de tiempo futuros)
// ======================================================
function guardarRegistroUnificado(entry) {
  const registros = getLS('registros'); // lista común para Timelapse.js
  registros.push(entry);
  setLS('registros', registros);
}

// ======================================================
// Submit: Servicio
// ======================================================
if (formServicio) {
  formServicio.addEventListener('submit', (e) => {
    e.preventDefault();

    const nombre = (inputNombre?.value || '').trim();
    const costoStr = (inputCosto?.value || '').trim();
    const moneda = selectMoneda?.value || '';
    const barbero = selectBarbero?.value || '';
    const fechaISO = inputFechaHoraServicio?.value || new Date().toISOString();

    const serviciosSeleccionados = Array.from(document.querySelectorAll('.servicio-btn.active'))
      .map(btn => btn.dataset.servicio);

    // Validaciones
    if (!nombre || !costoStr || !moneda || !barbero) {
      crearMensaje(formServicio, '❌ Completa nombre, costo, moneda y barbero.', 'error');
      return;
    }
    if (serviciosSeleccionados.length === 0) {
      crearMensaje(formServicio, '❌ Selecciona al menos un servicio.', 'error');
      return;
    }

    const costo = parseFloat(costoStr);
    if (isNaN(costo) || costo <= 0) {
      crearMensaje(formServicio, '❌ El costo debe ser mayor a 0.', 'error');
      return;
    }

    // Payload específico
    const payload = {
      tipo: 'Servicio',
      cliente: nombre,
      servicios: serviciosSeleccionados,
      barbero,
      costo,
      moneda,
      fecha: fechaISO
    };

    // Guardados
    const ingresos = getLS('ingresos'); // histórico servicios
    ingresos.push(payload);
    setLS('ingresos', ingresos);

    guardarRegistroUnificado({
      categoria: 'servicio',
      ...payload
    });

    actualizarContadoresServicios(serviciosSeleccionados);
    sumarTotalesIngresos(moneda, costo);

    crearMensaje(
      formServicio,
      `✅ Ingreso por servicio registrado:
Cliente: ${payload.cliente}
Servicios: ${payload.servicios.join(', ')}
Barbero: ${payload.barbero}
Monto: ${payload.costo} ${payload.moneda}`,
      'success'
    );

    // Limpiar
    formServicio.reset();
    servicioBtns.forEach(b => b.classList.remove('active'));
    // Regenerar sello de tiempo para el próximo registro
    if (inputFechaHoraServicio) inputFechaHoraServicio.value = new Date().toISOString();
  });
}

// ======================================================
// Submit: Efectivo
// ======================================================
if (formEfectivo) {
  formEfectivo.addEventListener('submit', (e) => {
    e.preventDefault();

    const cantidadStr = (inputCantidad?.value || '').trim();
    const monedaE = selectMonedaEfectivo?.value || '';
    const tipoPago = selectTipoPago?.value || '';
    const concepto = (inputConcepto?.value || '').trim();
    const fechaISO = inputFechaHoraEfectivo?.value || new Date().toISOString();

    if (!cantidadStr || !monedaE || !tipoPago) {
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

    const payload = {
      tipo: 'IngresoEfectivo',
      cantidad,
      moneda: monedaE,
      pago: tipoPago,
      concepto,
      fecha: fechaISO
    };

    // Guardados
    const ingresosEfectivo = getLS('ingresosEfectivo');
    ingresosEfectivo.push(payload);
    setLS('ingresosEfectivo', ingresosEfectivo);

    guardarRegistroUnificado({
      categoria: 'efectivo',
      ...payload
    });

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
    // Regenerar sello de tiempo para el próximo registro
    if (inputFechaHoraEfectivo) inputFechaHoraEfectivo.value = new Date().toISOString();
  });
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
function openMenu() { if (sideMenu && overlay) { sideMenu.style.left = '0'; overlay.style.display = 'block'; } }
function closeMenu() { if (sideMenu && overlay) { sideMenu.style.left = '-250px'; overlay.style.display = 'none'; } }
if (menuBtn && closeBtn && overlay && sideMenu) {
  menuBtn.addEventListener('click', openMenu);
  closeBtn.addEventListener('click', closeMenu);
  overlay.addEventListener('click', closeMenu);
}

// ======================================================
// Init
// ======================================================
document.addEventListener('DOMContentLoaded', () => {
  initBarberos();
  // Opcional: mostrar por defecto el formulario de Servicio
  showServicio();
});
