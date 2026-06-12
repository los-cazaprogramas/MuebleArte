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
function obtenerCarrito() {
    const carrito = localStorage.getItem('carritoMuebleArte');
    return carrito ? JSON.parse(carrito) : [];
}

function obtenerDatosEnvio() {
    const datos = localStorage.getItem('datosEnvio');
    return datos ? JSON.parse(datos) : null;
}

function obtenerDatosPago() {
    const datos = localStorage.getItem('datosPago');
    return datos ? JSON.parse(datos) : null;
}

function escapeHtml(texto) {
    if (!texto) return '';
    const div = document.createElement('div');
    div.textContent = texto;
    return div.innerHTML;
}

function renderizarProductos() {
    const carrito = obtenerCarrito();
    const container = document.getElementById('productosContainer');
    let subtotal = 0;

    if (carrito.length === 0) {
        container.innerHTML = '<div class="text-center py-3 text-muted">No hay productos en tu carrito.</div>';
        document.getElementById('subtotal').innerText = '$0';
        document.getElementById('total').innerText = '$0';
        return;
    }

    let html = '';
    carrito.forEach(item => {
        const totalItem = item.precio * item.cantidad;
        subtotal += totalItem;
        html += `<div class="product-item d-flex justify-content-between align-items-center">
                    <div><strong>${escapeHtml(item.nombre)}</strong><div class="small text-muted">Cantidad: ${item.cantidad}</div></div>
                    <div class="text-end"><strong>$${item.precio.toLocaleString()}</strong><div class="small text-muted">Subtotal: $${totalItem.toLocaleString()}</div></div>
                </div>`;
    });

    container.innerHTML = html;
    document.getElementById('subtotal').innerText = `$${subtotal.toLocaleString()}`;
    document.getElementById('total').innerText = `$${subtotal.toLocaleString()}`;
}

function renderizarDireccion() {
    const datos = obtenerDatosEnvio();
    const container = document.getElementById('direccionContainer');
    if (!datos) {
        container.innerHTML = '<p class="text-muted mb-0">No hay datos de envío.</p>';
        return;
    }
    container.innerHTML = `
        <p><span class="label">Nombre:</span> ${escapeHtml(datos.nombreCompleto || '')}</p>
        <p><span class="label">Dirección:</span> ${escapeHtml(datos.direccion || '')}</p>
        <p><span class="label">Ciudad:</span> ${escapeHtml(datos.ciudad || '')}</p>
        <p><span class="label">CP:</span> ${escapeHtml(datos.codigoPostal || '')}</p>
        <p><span class="label">Estado:</span> ${escapeHtml(datos.estado || '')}</p>
        <p><span class="label">País:</span> ${escapeHtml(datos.pais || '')}</p>
        <p><span class="label">Teléfono:</span> ${escapeHtml(datos.telefono || '')}</p>
    `;
}

function renderizarPago() {
    const datos = obtenerDatosPago();
    const container = document.getElementById('pagoContainer');
    if (!datos) {
        container.innerHTML = '<p class="text-muted mb-0">No hay datos de pago.</p>';
        return;
    }
    const ultimos = datos.numeroTarjeta ? datos.numeroTarjeta.slice(-4) : 'XXXX';
    container.innerHTML = `
        <p><span class="label">Tarjeta:</span> **** **** **** ${ultimos}</p>
        <p><span class="label">Expira:</span> ${escapeHtml(datos.fechaExpiracion || '')}</p>
        <p><span class="label">Titular:</span> ${escapeHtml(datos.nombreTarjeta || '')}</p>
    `;
}

function confirmarPedido() {
    const carrito = obtenerCarrito();
    const envio = obtenerDatosEnvio();
    const pago = obtenerDatosPago();

    if (carrito.length === 0) {
        alert('❌ No hay productos en tu carrito.');
        window.location.href = '/pages/categorias.html';
        return;
    }
    if (!envio) {
        alert('❌ Completa tus datos de envío.');
        window.location.href = '/pages/direccion-envio.html';
        return;
    }
    if (!pago) {
        alert('❌ Completa tus datos de pago.');
        window.location.href = '/pages/forma-pago.html';
        return;
    }

    if (confirm('¿Confirmar tu pedido?')) {
        const pedido = {
            id: 'ORD-' + Date.now(),
            fecha: new Date().toLocaleString(),
            productos: carrito,
            direccion: envio,
            total: carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0)
        };
        const historial = localStorage.getItem('historialPedidos');
        const pedidos = historial ? JSON.parse(historial) : [];
        pedidos.push(pedido);
        localStorage.setItem('historialPedidos', JSON.stringify(pedidos));
        localStorage.removeItem('carritoMuebleArte');

        // ALERTA DE ÉXITO
        alert('✅ ¡Pedido realizado con éxito! Gracias por comprar en MuebleArte.');

        window.location.href = '/index.html';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    renderizarProductos();
    renderizarDireccion();
    renderizarPago();
    document.getElementById('confirmarPedidoBtn').addEventListener('click', confirmarPedido);
});
