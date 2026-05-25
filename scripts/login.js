document.addEventListener("DOMContentLoaded", () => {

    const btnLogin = document.getElementById("btnLogin");
    const mensajeError = document.getElementById("mensajeError");

    btnLogin.addEventListener("click", (e) => {
        e.preventDefault();

        // Obtener valores
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();

        mensajeError.textContent = "";

        // Validar campos vacíos
        if (!email || !password) {
            mensajeError.textContent =
                "Todos los campos son obligatorios";
            return;
        }

        // Obtener usuarios del localStorage
        const usuarios =
            JSON.parse(localStorage.getItem("usuarios")) || [];

        // Buscar usuario
        const usuarioEncontrado = usuarios.find(
            usuario =>
                usuario.email === email &&
                usuario.password === password
        );

        // Validar credenciales
        if (!usuarioEncontrado) {
            mensajeError.textContent =
                "Correo o contraseña incorrectos";
            return;
        }

        // Guardar sesión activa
        localStorage.setItem(
            "usuarioActivo",
            JSON.stringify(usuarioEncontrado)
        );

        // Mostrar modal éxito
        const modal =
            new bootstrap.Modal(
                document.getElementById("loginExitosoModal")
            );

        modal.show();
    });

    // Redirección al dar click en continuar
    document
        .getElementById("continuarBtn")
        .addEventListener("click", () => {

            window.location.href = "/index.html";
        });

});