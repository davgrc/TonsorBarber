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
const formAgenda = document.getElementById('formAgenda');
const inputNombre = document.getElementById('clienteNombre');
const inputTelefono = document.getElementById('clienteTelefono');
const clientesList = document.getElementById('clientesList');

// ======================================================
// Renderizar lista de clientes
// ======================================================
function renderClientes() {
  const clientes = getLS('clientes');
  clientesList.innerHTML = '';

  clientes.forEach((cliente, index) => {
    const li = document.createElement('li');

    const span = document.createElement('span');
    span.textContent = `${cliente.nombre} - ${cliente.telefono}`;

    const removeBtn = document.createElement('button');
    removeBtn.textContent = '❌';
    removeBtn.classList.add('remove-btn');
    removeBtn.addEventListener('click', () => {
      eliminarCliente(index);
    });

    li.appendChild(span);
    li.appendChild(removeBtn);
    clientesList.appendChild(li);
  });
}

// ======================================================
// Agregar cliente
// ======================================================
if (formAgenda) {
  formAgenda.addEventListener('submit', (e) => {
    e.preventDefault();

    const nombre = inputNombre.value.trim();
    const telefono = inputTelefono.value.trim();

    if (!nombre || !telefono) {
      alert('Por favor completa nombre y teléfono.');
      return;
    }

    const clientes = getLS('clientes');
    clientes.push({ nombre, telefono });
    setLS('clientes', clientes);

    inputNombre.value = '';
    inputTelefono.value = '';

    renderClientes();
  });
}

// ======================================================
// Eliminar cliente
// ======================================================
function eliminarCliente(index) {
  const clientes = getLS('clientes');
  clientes.splice(index, 1);
  setLS('clientes', clientes);
  renderClientes();
}

// ======================================================
// Inicializar
// ======================================================
document.addEventListener('DOMContentLoaded', () => {
  renderClientes();
});
