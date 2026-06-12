const URL_BASE_API = CONFIG.API_PRODUCTOS_URL;

// Variable global para almacenar el producto que baje de la BD
let productoActual = null;

document.addEventListener("DOMContentLoaded", () => {
    // 1. Extraer el ID del producto desde la URL (?id=X)
    const parametrosUrl = new URLSearchParams(window.location.search);
    const idProducto = parametrosUrl.get("id");

    if (!idProducto) {
        mostrarToastEstetico("❌ Producto no especificado en la URL.", "error");
        return;
    }

    // 2. Cargar los datos y preparar el botón
    cargarDetalleProducto(idProducto);
    configurarEventoBotonCarrito();
});

// Fetch al backend de Spring Boot para traer la entidad Producto por ID
async function cargarDetalleProducto(id) {
    try {
        const respuesta = await fetch(`${URL_BASE_API}/${id}`);
        if (!respuesta.ok) {
            throw new Error("No se pudo obtener la información del producto");
        }
        
        productoActual = await respuesta.json();

        // Inyectar datos en tu estructura real de HTML de forma segura
        if (document.getElementById("det-nombre")) {
            document.getElementById("det-nombre").textContent = productoActual.nombreProducto;
        }
        if (document.getElementById("det-precio")) {
            document.getElementById("det-precio").textContent = `$${productoActual.precio.toLocaleString('es-MX')}.00 MXN`;
        }
        if (document.getElementById("det-descripcion")) {
            document.getElementById("det-descripcion").textContent = productoActual.descripcionProducto || "Sin descripción disponible.";
        }
        if (document.getElementById("det-codigo")) {
            document.getElementById("det-codigo").textContent = productoActual.codigoProducto || `MUE-${productoActual.id || productoActual.idProducto}`;
        }
        if (document.getElementById("det-breadcrumb-categoria")) {
            document.getElementById("det-breadcrumb-categoria").textContent = productoActual.categoria?.nombreCategoria || "Mueble";
        }
        
        // Manejo de Stock
        const stockElement = document.getElementById("det-stock");
        if (stockElement) {
            if (productoActual.stock > 0) {
                stockElement.textContent = "En Stock";
                stockElement.className = "badge bg-success";
            } else {
                stockElement.textContent = "Agotado";
                stockElement.className = "badge bg-danger";
            }
        }

        // Evaluamos la ruta de la imagen
        const imagenElement = document.getElementById("det-imagen");
        if (imagenElement) {
            let rutaFinal = "";

            if (productoActual.imagenUrl && productoActual.imagenUrl.trim() !== "") {
                const urlImg = productoActual.imagenUrl.trim();
                
                if (urlImg.startsWith('http://') || urlImg.startsWith('https://')) {
                    rutaFinal = urlImg;
                } else {
                    // Mapeo directo para tus imágenes guardadas localmente en Spring Boot
                    rutaFinal = CONFIG.API_BASE_URL + (urlImg.startsWith('/') ? urlImg : '/' + urlImg);
                }
            } else {
                rutaFinal = "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=800"; 
            }

            imagenElement.src = rutaFinal;

            // Respaldo por si la imagen física no se encuentra (Error 404)
            imagenElement.onerror = function() {
                this.src = "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=800";
            };
        }

        // Cargar sugerencias relacionadas
        if (productoActual.categoria?.idCategoria) {
            cargarProductosRelacionados(productoActual.categoria.idCategoria, productoActual.id || productoActual.idProducto);
        }

    } catch (error) {
        console.error("Error al renderizar el detalle:", error);
        mostrarToastEstetico("❌ Error al conectar con el servidor de Spring Boot.", "error");
    }
}

// Cargar sugerencias de la misma categoría
async function cargarProductosRelacionados(idCategoria, idProductoActual) {
    try {
        const respuesta = await fetch(URL_BASE_API);
        const todos = await respuesta.json();
        
        const filtrados = todos.filter(p => p.categoria?.idCategoria === idCategoria && (p.id || p.idProducto) !== idProductoActual).slice(0, 4);
        
        const contenedor = document.getElementById("contenedor-relacionados");
        if (!contenedor) return;
        contenedor.innerHTML = "";

        if (filtrados.length === 0) {
            contenedor.innerHTML = `<p class="text-muted small px-3">No hay más productos disponibles en esta categoría por el momento.</p>`;
            return;
        }

        filtrados.forEach(p => {
            let imgRuta = "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=800";
            if (p.imagenUrl && p.imagenUrl.trim() !== "") {
                const u = p.imagenUrl.trim();
                imgRuta = u.startsWith('http') ? u : CONFIG.API_BASE_URL + (u.startsWith('/') ? u : '/' + u);
            }

            contenedor.innerHTML += `
                <div class="col">
                    <div class="card h-100 border-0 shadow-sm">
                        <img src="${imgRuta}" class="card-img-top" style="height: 200px; object-fit: cover;" alt="${p.nombreProducto}">
                        <div class="card-body d-flex flex-column justify-content-between">
                            <div>
                                <h5 class="card-title fw-bold" style="font-size: 1rem;">${p.nombreProducto}</h5>
                                <p class="text-danger fw-semibold">$${p.precio.toLocaleString('es-MX')}.00</p>
                            </div>
                            <a href="/pages/detalle-producto.html?id=${p.id || p.idProducto}" class="btn btn-outline-dark btn-sm w-100 rounded-pill">Ver detalles</a>
                        </div>
                    </div>
                </div>
            `;
        });
    } catch (error) {
        console.error("Error cargando los relacionados:", error);
    }
}

// Configurar el click del botón de agregar al carrito
function configurarEventoBotonCarrito() {
    const btnAgregar = document.getElementById('btn-agregar-det');
    if (btnAgregar) {
        btnAgregar.removeAttribute('onclick'); 
        btnAgregar.onclick = function(e) {
            e.preventDefault();
            agregarAlCarritoDesdeDetalle();
        };
    }
}

// Embalaje del producto para mandarlo al carrito.js original
function agregarAlCarritoDesdeDetalle() {
    const parametrosUrl = new URLSearchParams(window.location.search);
    const idDesdeUrl = parametrosUrl.get("id");

    const selectCantidad = document.getElementById('det-cantidad');
    const cantidadSeleccionada = selectCantidad ? parseInt(selectCantidad.value, 10) : 1;

    const nombreHtml = document.getElementById("det-nombre")?.textContent || "Mueble";
    const precioTexto = document.getElementById("det-precio")?.textContent || "$0";
    const precioHtml = parseInt(precioTexto.replace(/[^0-9]/g, '')) || 0;
    const imagenHtml = document.getElementById("det-imagen")?.src || "";
    const descripcionHtml = document.getElementById("det-descripcion")?.textContent || "";

    const idReal = parseInt(productoActual?.id || productoActual?.idProducto || idDesdeUrl, 10);

    if (!idReal) {
        mostrarToastEstetico("❌ Error: No se pudo validar el identificador del mueble.", "error");
        return;
    }

    // Estructura limpia que espera recibir agregarProducto() de tu carrito.js
    const productoParaCarrito = {
        id: idReal,
        nombre: productoActual?.nombreProducto || nombreHtml,
        precio: productoActual?.precio ? parseInt(productoActual.precio) : precioHtml,
        imagen: productoActual?.imagenUrl 
            ? (productoActual.imagenUrl.startsWith('http') ? productoActual.imagenUrl : CONFIG.API_BASE_URL + (productoActual.imagenUrl.startsWith('/') ? productoActual.imagenUrl : '/' + productoActual.imagenUrl)) 
            : imagenHtml,
        descripcion: productoActual?.descripcionProducto || descripcionHtml,
        link: window.location.pathname + window.location.search
    };

    // Invocar tu función de agregarProducto declarada en scripts/carrito.js
    if (typeof agregarProducto === 'function') {
        for (let i = 0; i < cantidadSeleccionada; i++) {
            agregarProducto(productoParaCarrito);
        }
        
        if (typeof renderMiniCarrito === 'function') {
            renderMiniCarrito();
        }
        mostrarToastEstetico(`¡${productoParaCarrito.nombre} añadido al carrito con éxito! 🎉`, "success");
    } else {
        console.error("❌ No se encontró la función 'agregarProducto' de carrito.js");
        mostrarToastEstetico("❌ Error: No se pudo conectar con el sistema de almacenamiento del carrito.", "error");
    }
}

function mostrarToastEstetico(mensaje, tipo = "success") {
    const contenedor = document.getElementById("toast-container");
    if (!contenedor) return;

    const toast = document.createElement("div");
    toast.style.background = tipo === "success" ? "#b58d3d" : "#c0392b";
    toast.style.color = "#ffffff";
    toast.style.padding = "14px 24px";
    toast.style.marginBottom = "10px";
    toast.style.borderRadius = "30px"; 
    toast.style.fontWeight = "500";
    toast.style.boxShadow = "0 8px 24px rgba(0,0,0,0.12)";
    toast.style.display = "flex";
    toast.style.alignItems = "center";
    toast.textContent = mensaje;

    contenedor.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = "0";
        setTimeout(() => toast.remove(), 400);
    }, 3500);
}
