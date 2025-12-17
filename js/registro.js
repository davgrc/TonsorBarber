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
// Elementos del DOM
// ======================================================
const registroList = document.getElementById('registroList');
const btnIngresos = document.getElementById('btnIngresos');
const btnGastos = document.getElementById('btnGastos');

// ======================================================
// Renderizar tarjetas
// ======================================================
function renderRegistros(tipo) {
  registroList.innerHTML = '';

  let registros = [];
  if (tipo === 'ingreso') {
    registros = getLS('ingresos'); // [{cliente, servicios, edad, costo, moneda, fecha}]
  } else if (tipo === 'gasto') {
    registros = getLS('gastos'); // [{descripcion, cantidad, moneda, fecha}]
  }

  if (!registros || registros.length === 0) {
    registroList.innerHTML = `<p class="no-data">No hay ${tipo === 'ingreso' ? 'ingresos' : 'gastos'} registrados.</p>`;
    return;
  }

  registros.forEach((r, index) => {
    const card = document.createElement('div');
    card.className = `registro-card ${tipo}`;

    // Icono según servicio
    let icono = '';
    if (tipo === 'ingreso') {
      if (r.servicios && r.servicios.includes('Corte')) icono = '✂️';
      else if (r.servicios && r.servicios.includes('Barba')) icono = '🧔';
      else if (r.servicios && r.servicios.includes('Tinte')) icono = '🎨';
      else icono = '💵';
    } else {
      icono = '📉';
    }

    card.innerHTML = `
      <span class="icon">${icono}</span>
      <div class="info">
        ${tipo === 'ingreso' 
          ? `<p><strong>${r.servicios.join(', ') || 'Servicio'}:</strong> ${r.cliente || '—'}</p>
             <p><strong>Monto:</strong> ${r.costo} ${r.moneda}</p>`
          : `<p><strong>Gasto:</strong> ${r.descripcion || '—'}</p>
             <p><strong>Monto:</strong> ${r.cantidad} ${r.moneda}</p>`
        }
      </div>
      <div class="acciones">
        <button class="btn-accion ojo">👁️</button>
        <button class="btn-accion eliminar">❌</button>
      </div>
      <div class="detalle hidden">
        ${tipo === 'ingreso'
          ? `<p>Edad: ${r.edad || '—'}</p>
             <p>Fecha: ${r.fecha ? new Date(r.fecha).toLocaleString() : '—'}</p>
             <p>Moneda: ${r.moneda || '—'}</p>`
          : `<p>Fecha: ${r.fecha ? new Date(r.fecha).toLocaleString() : '—'}</p>
             <p>Moneda: ${r.moneda || '—'}</p>`
        }
      </div>
    `;

    // Acción expandir
    const btnOjo = card.querySelector('.ojo');
    btnOjo.addEventListener('click', () => {
      card.classList.toggle('expandido');
    });

    // Acción eliminar
    const btnEliminar = card.querySelector('.eliminar');
    btnEliminar.addEventListener('click', () => {
      registros.splice(index, 1);
      setLS(tipo === 'ingreso' ? 'ingresos' : 'gastos', registros);

      if (tipo === 'ingreso') {
        // 🔄 actualizar contador de servicios
        let counts = getLS('serviciosCount');
        counts = counts.map(c => {
          if (r.servicios && r.servicios.includes(c.tipo)) {
            c.total = Math.max(0, c.total - 1);
          }
          return c;
        });
        setLS('serviciosCount', counts);

        // 🔄 actualizar totales por moneda
        let totals = getLS('totalesIngresos');
        totals = totals.map(t => {
          if (t.moneda === r.moneda) {
            t.total = Math.max(0, t.total - r.costo);
          }
          return t;
        });
        setLS('totalesIngresos', totals);
      }

      renderRegistros(tipo);
    });

    registroList.appendChild(card);
  });
}

// ======================================================
// Inicializar con ingresos por defecto
// ======================================================
renderRegistros('ingreso');

// ======================================================
// Botones de filtro
// ======================================================
if (btnIngresos) btnIngresos.addEventListener('click', () => renderRegistros('ingreso'));
if (btnGastos) btnGastos.addEventListener('click', () => renderRegistros('gasto'));

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
