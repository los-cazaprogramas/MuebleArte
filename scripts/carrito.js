// =========================================
//  CARRITO CON JSON Y LOCALSTORAGE (SIN PRODUCTOS DESTACADOS)
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
// Esta función se debe llamar desde otras páginas (catálogo, producto) pasando un objeto producto completo.
// Ejemplo de uso:
//   agregarProducto({
//       id: 1,
//       nombre: "Librero de roble",
//       precio: 189900,
//       imagen: "ruta.jpg",
//       descripcion: "Breve descripción",
//       link: "/producto/librero.html"
//   });
function agregarProducto(producto) {
    // Validar que el producto tenga los campos necesarios
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
    renderizarCarrito();   // actualizar vista si estamos en la página del carrito
}

function eliminarProducto(idProducto) {
    carrito = carrito.filter(item => item.id !== idProducto);
    guardarCarrito();
    renderizarCarrito();
}

function vaciarCarrito() {
    carrito = [];
    guardarCarrito();
    renderizarCarrito();
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
                        <img src="${item.imagen}" alt="${item.nombre}" class="cart-product-img w-100">
                    </div>
                    <div class="col-md-5 col-8">
                        <h3 class="product-title">${item.nombre}</h3>
                        <p class="product-description">${item.descripcion}</p>
                        <div class="product-quantity">Cantidad: ${item.cantidad}</div>
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

    // Asignar eventos a los botones "Eliminar"
    document.querySelectorAll(".eliminar-item").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const id = parseInt(btn.getAttribute("data-id"));
            eliminarProducto(id);
        });
    });
}

// ---------- INICIALIZACIÓN ----------
document.addEventListener("DOMContentLoaded", () => {
    cargarCarrito();
    renderizarCarrito();

    // Botón vaciar carrito
    const vaciarBtn = document.getElementById("vaciarCarritoBtn");
    if (vaciarBtn) {
        vaciarBtn.addEventListener("click", vaciarCarrito);
    }

    // Botón proceder al pago
    const pagoBtn = document.getElementById("procederPagoBtn");
    if (pagoBtn) {
        pagoBtn.addEventListener("click", () => {
            alert("Funcionalidad de pago en construcción. El carrito se ha guardado.");
        });
    }
});