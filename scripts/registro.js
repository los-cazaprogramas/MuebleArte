document.addEventListener("DOMContentLoaded", () => {

    const btnRegistro =
        document.getElementById("btnRegistro");

    const mensajeError =
        document.getElementById("mensajeError");

    btnRegistro.addEventListener("click", (e) => {

        e.preventDefault();

        // Obtener valores
        const nombre =
            document.getElementById("nombre")
            .value.trim();

        const apellido =
            document.getElementById("apellido")
            .value.trim();

        const email =
            document.getElementById("email")
            .value.trim();

        const telefono =
            document.getElementById("telefono")
            .value.trim();

        const password =
            document.getElementById("password")
            .value.trim();

        const confirmarPassword =
            document.getElementById(
                "confirmar-password"
            ).value.trim();

        // Limpiar errores
        mensajeError.textContent = "";

        // Validar campos vacíos
        if (
            !nombre ||
            !apellido ||
            !email ||
            !telefono ||
            !password ||
            !confirmarPassword
        ) {
            mensajeError.textContent =
                "Todos los campos son obligatorios";
            return;
        }

        // Validar correo
        const emailValido =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailValido.test(email)) {
            mensajeError.textContent =
                "Ingresa un correo válido";
            return;
        }

        // Validar contraseña mínima
        if (password.length < 6) {
            mensajeError.textContent =
                "La contraseña debe tener al menos 6 caracteres";
            return;
        }

        // Confirmar contraseña
        if (password !== confirmarPassword) {
            mensajeError.textContent =
                "Las contraseñas no coinciden";
            return;
        }

        // Obtener usuarios existentes
        const usuarios =
            JSON.parse(
                localStorage.getItem("usuarios")
            ) || [];

        // Verificar correo repetido
        const usuarioExiste =
            usuarios.some(
                usuario =>
                    usuario.email === email
            );

        if (usuarioExiste) {
            mensajeError.textContent =
                "Este correo ya está registrado";
            return;
        }

        // Crear usuario
        const nuevoUsuario = {
            nombre,
            apellido,
            email,
            telefono,
            password
        };

        // Guardar usuario
        usuarios.push(nuevoUsuario);

        localStorage.setItem(
            "usuarios",
            JSON.stringify(usuarios)
        );

        // Limpiar formulario
        document.getElementById("nombre").value = "";
        document.getElementById("apellido").value = "";
        document.getElementById("email").value = "";
        document.getElementById("telefono").value = "";
        document.getElementById("password").value = "";
        document.getElementById("confirmar-password").value = "";

        // Mostrar modal éxito
        const modal =
            new bootstrap.Modal(
                document.getElementById(
                    "registroExitosoModal"
                )
            );

        modal.show();
    });

    // Ir al login
    document
        .getElementById("irLoginBtn")
        .addEventListener("click", () => {

            window.location.href =
                "/pages/login.html";
        });

});