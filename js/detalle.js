const URL_BASE_API = "http://localhost:8080/api/productos";

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

        // Inyectar datos en el HTML de forma segura
        if (document.getElementById("det-nombre")) {
            document.getElementById("det-nombre").textContent = productoActual.nombreProducto;
        }
        if (document.getElementById("det-precio")) {
            document.getElementById("det-precio").textContent = `$${productoActual.precio.toLocaleString('es-MX')}.00 MXN`;
        }
        if (document.getElementById("det-descripcion")) {
            document.getElementById("det-descripcion").textContent = productoActual.descripcionProducto;
        }
        if (document.getElementById("det-codigo")) {
            document.getElementById("det-codigo").textContent = productoActual.codigoProducto;
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
                    // Caso 1: La URL ya viene completa desde el backend (ej. un servidor externo o Cloudinary)
                    rutaFinal = urlImg;
                } else if (urlImg.startsWith('/assets/') || urlImg.startsWith('assets/')) {
                    // Caso 2: Es una imagen local del Frontend. 
                    // Si empieza con 'assets', le aseguramos el slash inicial para que busque desde la raíz del proyecto.
                    rutaFinal = urlImg.startsWith('/') ? urlImg : `/${urlImg}`;
                } else {
                    // Caso 3: Es una ruta relativa del backend de Spring Boot (ej. /uploads/mueble.jpg)
                    // Le concatenamos el puerto de tu servidor de Java.
                    rutaFinal = urlImg.startsWith('/') ? `http://localhost:8080${urlImg}` : `http://localhost:8080/${urlImg}`;
                }
            } else {
                // Caso 4: Por si la base de datos devuelve null o vacío, ponemos una de stock elegante
                rutaFinal = "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=800&auto=format&fit=crop"; 
            }

            // Inyectar la ruta al atributo src del HTML
            imagenElement.src = rutaFinal;

            // Guardar un respaldo en caso de que la imagen de Spring Boot de un error 404 (No encontrada)
            imagenElement.onerror = function() {
                console.warn(`⚠️ No se pudo cargar la imagen en: ${rutaFinal}. Usando respaldo elegante.`);
                this.src = "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=800&auto=format&fit=crop";
            };
        }
        // Cargar sugerencias relacionadas
        if (productoActual.categoria?.idCategoria) {
            cargarProductosRelacionados(productoActual.categoria.idCategoria, productoActual.idProducto);
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
        
        const filtrados = todos.filter(p => p.categoria?.idCategoria === idCategoria && p.idProducto !== idProductoActual).slice(0, 4);
        
        const contenedor = document.getElementById("contenedor-relacionados");
        if (!contenedor) return;
        contenedor.innerHTML = "";

        if (filtrados.length === 0) {
            contenedor.innerHTML = `<p class="text-muted">No hay más productos disponibles en esta categoría por el momento.</p>`;
            return;
        }

        filtrados.forEach(p => {
            const imgRuta = p.imagenUrl ? (p.imagenUrl.startsWith('http') ? p.imagenUrl : `http://localhost:8080${p.imagenUrl}`) : "https://placehold.co/300x200?text=Mueble";
            contenedor.innerHTML += `
                <div class="col">
                    <div class="card h-100 border-0 shadow-sm">
                        <img src="${imgRuta}" class="card-img-top" style="height: 200px; object-fit: cover;" alt="${p.nombreProducto}">
                        <div class="card-body">
                            <h5 class="card-title fw-bold">${p.nombreProducto}</h5>
                            <p class="text-danger fw-semibold">$${p.precio.toLocaleString('es-MX')}.00</p>
                            <a href="/pages/detalle-producto.html?id=${p.idProducto}" class="btn btn-outline-dark btn-sm w-100">Ver detalles</a>
                        </div>
                    </div>
                </div>
            `;
        });
    } catch (error) {
        console.error("Error cargando los relacionados:", error);
    }
}

// Configurar el click del botón
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

// Lógica de acoplamiento que invoca a tu carrito.js original
function agregarAlCarritoDesdeDetalle() {
    const parametrosUrl = new URLSearchParams(window.location.search);
    const idDesdeUrl = parametrosUrl.get("id");

    // Capturar cantidad seleccionada del DOM
    const selectCantidad = document.getElementById('det-cantidad');
    const cantidadSeleccionada = selectCantidad ? parseInt(selectCantidad.value, 10) : 1;

    // Rescate de respaldos desde el HTML
    const nombreHtml = document.getElementById("det-nombre")?.textContent || "Mueble";
    const precioTexto = document.getElementById("det-precio")?.textContent || "$0";
    const precioHtml = parseInt(precioTexto.replace(/[^0-9]/g, '')) || 0;
    const imagenHtml = document.getElementById("det-imagen")?.src || "";
    const descripcionHtml = document.getElementById("det-descripcion")?.textContent || "";

    // ID definitivo mapeado a entero
    const idReal = parseInt(productoActual?.idProducto || productoActual?.id || idDesdeUrl, 10);

    if (!idReal) {
        mostrarToastEstetico("❌ Error: No se pudo validar el identificador del mueble.", "error");
        return;
    }

    // 📦 CONSTRUCCIÓN DEL OBJETO EXACTO QUE TU 'carrito.js' NECESITA
    const productoParaCarrito = {
        id: idReal,
        nombre: productoActual?.nombreProducto || nombreHtml,
        precio: productoActual?.precio ? parseInt(productoActual.precio) : precioHtml,
        imagen: productoActual?.imagenUrl 
            ? (productoActual.imagenUrl.startsWith('http') ? productoActual.imagenUrl : `http://localhost:8080${productoActual.imagenUrl}`) 
            : imagenHtml,
        descripcion: productoActual?.descripcionProducto || descripcionHtml,
        link: window.location.pathname + window.location.search
    };

    // ⚡ Llama a la función global de tu 'carrito.js' tantas veces como unidades pida el selector
    if (typeof agregarProducto === 'function') {
        for (let i = 0; i < cantidadSeleccionada; i++) {
            agregarProducto(productoParaCarrito);
        }
        
        // Si tienes la vista del mini carrito (Offcanvas) importada, la refrescamos también
        if (typeof renderMiniCarrito === 'function') {
            renderMiniCarrito();
        }
    } else {
        console.error("❌ No se encontró la función 'agregarProducto' de carrito.js");
    }

    // 🔥 Lanzar Toast Premium de Éxito
    mostrarToastEstetico(`¡${productoParaCarrito.nombre} añadido al carrito con éxito! 🎉`, "success");
}

// FUNCIÓN MAESTRA: NOTIFICACIÓN FLOTANTE INTEGRADA (TOAST PREMIUM)
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
    toast.style.fontSize = "0.95rem";
    toast.style.fontFamily = "'Segoe UI', Roboto, sans-serif";
    toast.style.boxShadow = "0 8px 24px rgba(0,0,0,0.12)";
    toast.style.opacity = "0";
    toast.style.transform = "translateY(-30px) scale(0.9)";
    toast.style.transition = "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)";
    toast.style.display = "flex";
    toast.style.alignItems = "center";
    toast.style.gap = "8px";
    
    toast.textContent = mensaje;
    contenedor.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = "1";
        toast.style.transform = "translateY(0) scale(1)";
    }, 40);

    setTimeout(() => {
        toast.style.opacity = "0";
        toast.style.transform = "translateY(-20px) scale(0.9)";
        setTimeout(() => {
            toast.remove();
        }, 400);
    }, 3500);
}
