document.addEventListener("DOMContentLoaded", () => {

    const usuarioActivo =
        JSON.parse(
            localStorage.getItem("usuarioActivo")
        );

    const botonesAuth =
        document.getElementById("botonesAuth");

    const usuarioLogueado =
        document.getElementById("usuarioLogueado");

    const nombreUsuarioNavbar =
        document.getElementById("nombreUsuarioNavbar");

    const cerrarSesionBtn =
        document.getElementById("cerrarSesionBtn");

    // Mostrar usuario si existe sesión
    if (
        usuarioActivo &&
        botonesAuth &&
        usuarioLogueado &&
        nombreUsuarioNavbar
    ) {

        botonesAuth.classList.add("d-none");

        usuarioLogueado.classList.remove("d-none");

        nombreUsuarioNavbar.textContent =
            usuarioActivo.nombre;
    }

    // Cerrar sesión
    if (cerrarSesionBtn) {

        cerrarSesionBtn.addEventListener("click", () => {

            localStorage.removeItem(
                "usuarioActivo"
            );

            window.location.href =
                "/index.html";
        });
    }
});