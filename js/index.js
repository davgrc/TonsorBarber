// ======================================================
// Capturamos elementos del DOM
// ======================================================
const loginForm = document.getElementById('loginForm');   // Formulario de login
const errorMsg = document.getElementById('errorMsg');     // Contenedor del mensaje

// ======================================================
// Evento: envío del formulario
// ======================================================
loginForm.addEventListener('submit', function(event) {
  event.preventDefault(); // Evita recargar la página

  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();

  // Caso 1: campos vacíos
  if (!username || !password) {
    mostrarError("❌ Error: Debes completar todos los campos.");
    return;
  }

  // Caso 2: credenciales correctas
  if (username === "admin" && password === "1234") {
    limpiarMensaje();
    mostrarExito("✅ Bienvenido, acceso concedido. Redirigiendo al Dashboard...");
    setTimeout(() => {
      window.location.href = "dashboard.html";
    }, 2000);
    return;
  }

  // Caso 3: credenciales incorrectas
  if (username !== "admin" && password !== "1234") {
    mostrarError("❌ Error: Usuario y contraseña incorrectos.");
  } else if (username !== "admin") {
    mostrarError("❌ Error: Usuario incorrecto.");
  } else {
    mostrarError("❌ Error: Contraseña incorrecta.");
  }
});

// ======================================================
// Funciones auxiliares
// ======================================================

// Mostrar error en rojo
function mostrarError(mensaje) {
  errorMsg.textContent = mensaje;
  errorMsg.classList.remove('hidden');
  errorMsg.style.color = "#dc3545";
  errorMsg.style.background = "#f8d7da";
  errorMsg.style.border = "1px solid #dc3545";

  // Eliminar mensaje automáticamente después de 4 segundos
  setTimeout(() => limpiarMensaje(), 4000);
}

// Mostrar éxito en verde
function mostrarExito(mensaje) {
  errorMsg.textContent = mensaje;
  errorMsg.classList.remove('hidden');
  errorMsg.style.color = "#28a745";
  errorMsg.style.background = "#d4edda";
  errorMsg.style.border = "1px solid #28a745";
}

// Limpiar mensaje
function limpiarMensaje() {
  errorMsg.textContent = "";
  errorMsg.classList.add('hidden');
}
