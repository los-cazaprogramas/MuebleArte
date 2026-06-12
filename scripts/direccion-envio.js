document.addEventListener("DOMContentLoaded", () => {
    const formDireccion = document.getElementById("formDireccion");
    if (formDireccion) {
        formDireccion.addEventListener("submit", (e) => {
            e.preventDefault();
            
            // Guardamos las entradas del usuario en el localStorage
            localStorage.setItem("checkout_nombre", document.getElementById("nombreCompleto").value);
            localStorage.setItem("checkout_direccion", document.getElementById("direccion").value);
            localStorage.setItem("checkout_ciudad", document.getElementById("ciudad").value);
            localStorage.setItem("checkout_cp", document.getElementById("codigoPostal").value);
            localStorage.setItem("checkout_estado", document.getElementById("estado").value);
            
            window.location.href = "./forma-pago.html";
        });
    }
});
