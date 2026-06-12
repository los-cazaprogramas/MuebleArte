document.addEventListener("DOMContentLoaded", () => {
    const formPago = document.getElementById("formPago");
    if (formPago) {
        formPago.addEventListener("submit", (e) => {
            e.preventDefault();
            
            const tarjetaVal = document.getElementById("numTarjeta").value.replace(/\s+/g, '');
            const ultimosDigitos = tarjetaVal.slice(-4) || "4111"; // Toma los últimos 4 números
            
            localStorage.setItem("checkout_tarjeta", ultimosDigitos);
            
            window.location.href = "./confirmacion-pedido.html";
        });
    }
});
