// 1. Simular base de datos
function inicializarUsuarioPrueba() {
    const usuarioPrueba = {
        username: "admin",
        passwordCodificada: btoa("12345") // Contraseña "12345" codificada en Base64
    };
    localStorage.setItem("usuarioRegistrado", JSON.stringify(usuarioPrueba));
}
inicializarUsuarioPrueba();

// 2. Capturar elementos del DOM (HTML)
const formulario = document.getElementById("formulario-login");
const inputUsuario = document.getElementById("usuario");
const inputPassword = document.getElementById("password");
const mensajeErrorDiv = document.getElementById("mensaje-error");

// 3. Lógica al enviar el formulario
formulario.addEventListener("submit", function(evento) {
    evento.preventDefault(); // Evita que la página se recargue

    // Ocultar errores previos
    mensajeErrorDiv.classList.add("d-none");
    mensajeErrorDiv.textContent = "";

    const valorUsuario = inputUsuario.value.trim();
    const valorPassword = inputPassword.value.trim();

    // Regla 1: Campos vacíos
    if (valorUsuario === "" || valorPassword === "") {
        mostrarError("Por favor, ingresa tu nombre de usuario y contraseña.");
        return;
    }

    // Regla 2: Validar contra Local Storage
    const datosGuardados = JSON.parse(localStorage.getItem("usuarioRegistrado"));
    const passwordIngresadaCodificada = btoa(valorPassword);

    if (valorUsuario === datosGuardados.username && passwordIngresadaCodificada === datosGuardados.passwordCodificada) {
        // Redirigir si es correcto (ajusta la ruta si tu index está en otra carpeta)
        window.location.href = "index.html"; 
    } else {
        // Regla 3: Datos inválidos
        mostrarError("Nombre de usuario o contraseña incorrectos.");
    }
});

function mostrarError(mensaje) {
    mensajeErrorDiv.textContent = mensaje;
    mensajeErrorDiv.classList.remove("d-none");
}