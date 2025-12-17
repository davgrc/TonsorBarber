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
// Función para mostrar mensajes elegantes en formularios
// ======================================================
function crearMensaje(form, texto, tipo = 'success') {
  // Elimina mensajes previos
  const prev = form.querySelector('.mensaje');
  if (prev) prev.remove();

  // Crear contenedor
  const div = document.createElement('div');
  div.className = `mensaje ${tipo}`;
  div.textContent = texto;

  // Estilos básicos inline (puedes moverlos a CSS)
  div.style.marginTop = '10px';
  div.style.padding = '10px';
  div.style.borderRadius = '6px';
  div.style.fontSize = '14px';
  div.style.fontWeight = '600';
  div.style.textAlign = 'center';
  div.style.color = tipo === 'error' ? '#fff' : '#000';
  div.style.backgroundColor = tipo === 'error' ? '#dc3545' : '#28a745';

  // Insertar después del botón
  form.appendChild(div);

  // Quitar mensaje después de 3 segundos
  setTimeout(() => div.remove(), 3000);
}


// ======================================================
// Inicializar totales si no existen
// ======================================================
function initTotales() {
  let totals = getLS('totalesIngresos');
  if (totals.length === 0) {
    totals = [
      { moneda: 'Bs', total: 0 },
      { moneda: 'USD', total: 0 },
      { moneda: 'COP', total: 0 }
    ];
    setLS('totalesIngresos', totals);
  }
}
initTotales();

// ======================================================
// Formulario de Gasto
// ======================================================
const formGasto = document.getElementById('formGasto');

if (formGasto) {
  formGasto.addEventListener('submit', (e) => {
    e.preventDefault();

    const descripcion = document.getElementById('descripcion').value.trim();
    const cantidadStr = document.getElementById('cantidadGasto').value.trim();
    const monedaG = document.getElementById('monedaGasto').value;

    // Validaciones
    if (!descripcion || !cantidadStr || !monedaG) {
      crearMensaje(formGasto, '❌ Completa descripción, cantidad y moneda.', 'error');
      return;
    }

    const cantidad = parseFloat(cantidadStr);
    if (isNaN(cantidad) || cantidad <= 0) {
      crearMensaje(formGasto, '❌ La cantidad debe ser mayor a 0.', 'error');
      return;
    }

    // Guardar gasto individual (historial)
    const gastos = getLS('gastos');
    const payload = {
      tipo: 'Gasto',
      descripcion,
      cantidad,
      moneda: monedaG,
      fecha: new Date().toISOString()
    };
    gastos.push(payload);
    setLS('gastos', gastos);

    // Actualizar totales de ingresos por moneda (resta)
    let totals = getLS('totalesIngresos');
    let found = false;
    totals = totals.map(t => {
      if (t.moneda === monedaG) {
        t.total = Math.max(0, t.total - cantidad);
        found = true;
      }
      return t;
    });
    // Si no existía la moneda, la añadimos
    if (!found) {
      totals.push({ moneda: monedaG, total: 0 });
    }
    setLS('totalesIngresos', totals);

    // Mensaje visual
    crearMensaje(
      formGasto,
      `✅ Gasto registrado:
Descripción: ${payload.descripcion}
Monto: ${payload.cantidad} ${payload.moneda}`,
      'success'
    );

    formGasto.reset();
  });
}

// ======================================================
// Banner navegación
// ======================================================
const bannerTitle = document.getElementById('bannerTitle');
const logoutBtn = document.getElementById('logoutBtn');
if (bannerTitle) bannerTitle.addEventListener('click', () => (window.location.href = 'dashboard.html'));
if (logoutBtn) logoutBtn.addEventListener('click', () => (window.location.href = 'index.html'));

// Menú lateral
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
