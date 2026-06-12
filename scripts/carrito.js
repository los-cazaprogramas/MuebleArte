// =========================================
//  CARRITO CON JSON Y LOCALSTORAGE
// =========================================

// Variable global del carrito
let carrito = [];

// ---------- FUNCIONES DE PERSISTENCIA (JSON + localStorage) ----------
function guardarCarrito() {
    localStorage.setItem("carritoMuebleArte", JSON.stringify(carrito));
}

function cargarCarrito() {
    const datosGuardados = localStorage.getItem("carritoMuebleArte");
    if (datosGuardados) {
        carrito = JSON.parse(datosGuardados);
    } else {
        carrito = [];
    }
}

// ---------- FUNCIONES PARA MODIFICAR EL CARRITO ----------
function agregarProducto(producto) {
    if (!producto.id || !producto.nombre || !producto.precio) return;

    const existe = carrito.find(item => item.id === producto.id);
    if (existe) {
        existe.cantidad++;
    } else {
        carrito.push({
            id: producto.id,
            nombre: producto.nombre,
            precio: producto.precio,
            imagen: producto.imagen,
            descripcion: producto.descripcion || "",
            link: producto.link || "#",
            cantidad: 1
        });
    }
    guardarCarrito();
    renderizarCarrito();
}

function eliminarProducto(idProducto) {
    carrito = carrito.filter(item => item.id !== idProducto);
    guardarCarrito();
    renderizarCarrito();
}

function cambiarCantidad(id, delta) {
    const item = carrito.find(p => p.id === id);
    if (!item) return;
    item.cantidad += delta;
    if (item.cantidad <= 0) {
        carrito = carrito.filter(p => p.id !== id);
    }
    guardarCarrito();
    renderizarCarrito();
}

function vaciarCarrito() {
    if (carrito.length === 0) return;
    if (confirm('¿Estás seguro de que quieres vaciar todo el carrito?')) {
        carrito = [];
        guardarCarrito();
        renderizarCarrito();
    }
}

// ---------- RENDERIZADO DEL CARRITO ----------
function renderizarCarrito() {
    const contenedor = document.getElementById("cartItemsList");
    const subtotalSpan = document.getElementById("subtotal");
    const totalSpan = document.getElementById("total");

    if (!contenedor) return;

    if (carrito.length === 0) {
        contenedor.innerHTML = `<div class="text-center text-muted py-5">Tu carrito está vacío.</div>`;
        if (subtotalSpan) subtotalSpan.innerText = "$0";
        if (totalSpan) totalSpan.innerText = "$0";
        return;
    }

    let html = "";
    let subtotal = 0;

    carrito.forEach(item => {
        const totalItem = item.precio * item.cantidad;
        subtotal += totalItem;

        html += `
            <div class="cart-item" data-id="${item.id}">
                <div class="row align-items-center g-3">
                    <div class="col-md-3 col-4">
                        <img src="${item.imagen}" alt="${item.nombre}" class="cart-product-img w-100" loading="lazy">
                    </div>
                    <div class="col-md-5 col-8">
                        <h3 class="product-title">${escapeHtml(item.nombre)}</h3>
                        <p class="product-description">${escapeHtml(item.descripcion)}</p>
                        <div class="d-flex align-items-center gap-2 mt-2">
                            <button class="btn btn-qty btn-qty-minus" data-id="${item.id}" data-delta="-1">−</button>
                            <span class="fw-semibold qty-value">${item.cantidad}</span>
                            <button class="btn btn-qty btn-qty-plus" data-id="${item.id}" data-delta="1">+</button>
                        </div>
                        <div class="d-flex flex-wrap gap-2 mt-2">
                            <a href="${item.link}" class="btn btn-sm btn-outline-view btn-capsule">
                                <i class="bi bi-eye"></i> Ver producto
                            </a>
                            <button class="btn btn-sm btn-outline-remove btn-capsule eliminar-item" data-id="${item.id}">
                                <i class="bi bi-x-lg"></i> Eliminar
                            </button>
                        </div>
                    </div>
                    <div class="col-md-4 col-12 text-md-end">
                        <span class="product-price">$${item.precio.toLocaleString()}</span>
                        <div class="product-subtotal small text-muted">Subtotal: $${totalItem.toLocaleString()}</div>
                    </div>
                </div>
            </div>
        `;
    });

    contenedor.innerHTML = html;

    const envio = 0;
    const total = subtotal + envio;
    if (subtotalSpan) subtotalSpan.innerText = `$${subtotal.toLocaleString()}`;
    if (totalSpan) totalSpan.innerText = `$${total.toLocaleString()}`;

    // Asignar eventos a los botones de cantidad
    document.querySelectorAll(".btn-qty-minus, .btn-qty-plus").forEach(btn => {
        btn.removeEventListener('click', handleCantidadClick);
        btn.addEventListener('click', handleCantidadClick);
    });

    // Asignar eventos a los botones "Eliminar"
    document.querySelectorAll(".eliminar-item").forEach(btn => {
        btn.removeEventListener('click', handleEliminarClick);
        btn.addEventListener('click', handleEliminarClick);
    });
}

// Manejadores de eventos
function handleCantidadClick(e) {
    const btn = e.currentTarget;
    const id = parseInt(btn.getAttribute("data-id"));
    const delta = parseInt(btn.getAttribute("data-delta"));
    cambiarCantidad(id, delta);
}

function handleEliminarClick(e) {
    const btn = e.currentTarget;
    const id = parseInt(btn.getAttribute("data-id"));
    eliminarProducto(id);
}

// Función de seguridad para evitar XSS
function escapeHtml(texto) {
    if (!texto) return '';
    const div = document.createElement('div');
    div.textContent = texto;
    return div.innerHTML;
}

// ---------- INICIALIZACIÓN ----------
document.addEventListener("DOMContentLoaded", () => {
    cargarCarrito();
    renderizarCarrito();

    // Botón vaciar carrito
    const vaciarBtn = document.getElementById("vaciarCarritoBtn");
    if (vaciarBtn) {
        vaciarBtn.removeEventListener('click', vaciarCarrito);
        vaciarBtn.addEventListener('click', vaciarCarrito);
    }

    // Botón proceder al pago - REDIRIGE A LA PASARELA (direccion-envio.html)
    const pagoBtn = document.getElementById("procederPagoBtn");
    if (pagoBtn) {
        pagoBtn.removeEventListener('click', irAPasarela);
        pagoBtn.addEventListener('click', irAPasarela);
    }
});

// ---------- REDIRIGIR A PASARELA DE PAGO ----------
function irAPasarela() {
    if (carrito.length === 0) {
        alert('❌ Tu carrito está vacío. Agrega productos antes de continuar.');
        return;
    }
    window.location.href = '/pages/direccion-envio.html';
}