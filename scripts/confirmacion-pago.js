document.addEventListener("DOMContentLoaded", () => {
    const dirContainer = document.getElementById("direccionDinamica");
    const pagoContainer = document.getElementById("pagoDinamico");

    // Extraemos las variables guardadas en la "libreta" del navegador
    const nombre = localStorage.getItem("checkout_nombre") || "No especificado";
    const dir = localStorage.getItem("checkout_direccion") || "No especificado";
    const ciudad = localStorage.getItem("checkout_ciudad") || "";
    const estado = localStorage.getItem("checkout_estado") || "";
    const cp = localStorage.getItem("checkout_cp") || "";
    const tarjeta = localStorage.getItem("checkout_tarjeta") || "4111";

    // Las pintamos en el paso 3 manteniendo tus estilos de tarjeta
    if (dirContainer) {
        dirContainer.innerHTML = `
            <p class="mb-1"><strong>${nombre}</strong></p>
            <p class="mb-1">${dir}</p>
            <p class="mb-0">${ciudad}, ${estado}, CP ${cp}</p>
        `;
    }

    if (pagoContainer) {
        pagoContainer.innerHTML = `
            <p class="mb-0"><i class="bi bi-credit-card me-2"></i> Tarjeta terminada en *${tarjeta}</p>
        `;
    }

    // Botón final de éxito
    const btnFinalizar = document.getElementById("btnFinalizar");
    if (btnFinalizar) {
        btnFinalizar.addEventListener("click", () => {
            alert(`¡Gracias por tu compra, ${nombre}! 🎉 Pedido procesado con éxito en la simulación.`);
            localStorage.clear(); // Limpia la libreta para una nueva prueba
            window.location.href = "/index.html";
        });
    }
});
