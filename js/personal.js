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
// DOM Elements
// ======================================================
const formPersonal = document.getElementById('formPersonal');
const inputNombre = document.getElementById('personalNombre');
const selectCargo = document.getElementById('personalCargo');
const personalList = document.getElementById('personalList');
const btnAgregarCargo = document.getElementById('btnAgregarCargo');

// ======================================================
// Renderizar lista de personal
// ======================================================
function renderPersonal() {
  const personal = getLS('personal');
  personalList.innerHTML = '';

  personal.forEach((p, index) => {
    const li = document.createElement('li');

    const span = document.createElement('span');
    span.textContent = `${p.nombre} - ${p.cargo}`;

    const removeBtn = document.createElement('button');
    removeBtn.textContent = '❌';
    removeBtn.classList.add('remove-btn');
    removeBtn.addEventListener('click', () => {
      eliminarPersonal(index);
    });

    li.appendChild(span);
    li.appendChild(removeBtn);
    personalList.appendChild(li);
  });
}

// ======================================================
// Agregar personal
// ======================================================
if (formPersonal) {
  formPersonal.addEventListener('submit', (e) => {
    e.preventDefault();

    const nombre = inputNombre.value.trim();
    const cargo = selectCargo.value;

    if (!nombre || !cargo) {
      alert('Por favor completa nombre y cargo.');
      return;
    }

    const personal = getLS('personal');
    personal.push({ nombre, cargo });
    setLS('personal', personal);

    inputNombre.value = '';
    selectCargo.value = 'Barbero'; // reset al valor por defecto

    renderPersonal();
  });
}

// ======================================================
// Eliminar personal
// ======================================================
function eliminarPersonal(index) {
  const personal = getLS('personal');
  personal.splice(index, 1);
  setLS('personal', personal);
  renderPersonal();
}

// ======================================================
// Agregar cargos dinámicos
// ======================================================
if (btnAgregarCargo) {
  btnAgregarCargo.addEventListener('click', () => {
    const nuevoCargo = prompt('Ingrese el nuevo cargo:');
    if (nuevoCargo && nuevoCargo.trim() !== '') {
      const option = document.createElement('option');
      option.value = nuevoCargo.trim();
      option.textContent = nuevoCargo.trim();
      selectCargo.appendChild(option);
      selectCargo.value = nuevoCargo.trim();
    }
  });
}

// ======================================================
// Inicializar
// ======================================================
document.addEventListener('DOMContentLoaded', () => {
  renderPersonal();
});
