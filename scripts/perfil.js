document.addEventListener("DOMContentLoaded", () => {

    const usuarioActivo =
        JSON.parse(
            localStorage.getItem("usuarioActivo")
        );

    // Si no hay sesión → login
    if (!usuarioActivo) {

        window.location.href =
            "/pages/login.html";

        return;
    }

    // Pintar datos
    document.getElementById(
        "nombreSidebar"
    ).textContent =
        usuarioActivo.nombre;

    document.getElementById(
        "nombreCompleto"
    ).textContent =
        `${usuarioActivo.nombre}
        ${usuarioActivo.apellido}`;

    document.getElementById(
        "emailUsuario"
    ).textContent =
        usuarioActivo.email;

    document.getElementById(
        "telefonoUsuario"
    ).textContent =
        usuarioActivo.telefono;

    // Cerrar sesión
    const cerrarSesion = () => {

        localStorage.removeItem(
            "usuarioActivo"
        );

        window.location.href =
            "/index.html";
    };

    document
        .getElementById(
            "cerrarSesionBtn"
        )
        .addEventListener(
            "click",
            cerrarSesion
        );

    document
        .getElementById(
            "cerrarSesionHeader"
        )
        .addEventListener(
            "click",
            cerrarSesion
        );

});