const URL_BASE_API_PROD = "http://localhost:8080/api/productos";

document.addEventListener("DOMContentLoaded", () => {
    console.log("🚀 Script productos.js (Catálogo General) cargado correctamente.");
    
    // Solo ejecutamos la carga si estamos en una página que contiene el contenedor de productos
    if (document.getElementById("contenedor-productos") || document.querySelector('.row-cols-md-4') || idExisteContenedorCatalogo()) {
        cargarProductosCatalogo();
    }
});

// Función auxiliar para detectar si estamos en la página principal con secciones de catálogo
function idExisteContenedorCatalogo() {
    // Busca si existen secciones o encabezados típicos de tu index.html
    const textoPagina = document.body.innerHTML;
    return textoPagina.includes("Categorías") && !window.location.pathname.includes("detalle-producto.html");
}

// Fetch para traer todos los productos de Spring Boot y pintarlos en la página principal
async function cargarProductosCatalogo() {
    try {
        const respuesta = await fetch(URL_BASE_API_PROD);
        if (!respuesta.ok) {
            throw new Error(`Error en la petición: ${respuesta.status}`);
        }
        
        const productos = await respuesta.json();
        console.log("📦 Catálogo recibido desde el backend:", productos);

        // Renderizar los productos agrupados o generales
        renderizarCatalogoPrincipal(productos);

    } catch (error) {
        console.error("❌ Error al cargar el catálogo de productos:", error);
        if (typeof mostrarToastEstetico === 'function') {
            mostrarToastEstetico("❌ No se pudo conectar con el servidor para cargar los productos.", "error");
        }
    }
}

// Mapea los productos en sus respectivos bloques del HTML (Sillas, Mesas, etc.)
function renderizarCatalogoPrincipal(productos) {
    // NOTA: Ajusta estos IDs según cómo tengas estructurado el HTML de tu página principal.
    // Si tienes un contenedor global, puedes usarlo. Si está segmentado por categoría:
    const contenedorSillas = document.getElementById("contenedor-sillas") || document.querySelector('[id*="sillas"]');
    const contenedorMesas = document.getElementById("contenedor-mesas") || document.querySelector('[id*="mesas"]');
    const contenedorGlobal = document.getElementById("contenedor-productos");

    // Limpieza previa de contenedores para evitar duplicados
    if (contenedorSillas) contenedorSillas.innerHTML = "";
    if (contenedorMesas) contenedorMesas.innerHTML = "";
    if (contenedorGlobal) contenedorGlobal.innerHTML = "";

    productos.forEach(producto => {
        // Formatear la ruta de la imagen de forma segura
        let imgRuta = "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=800";
        if (producto.imagenUrl && producto.imagenUrl.trim() !== "") {
            const u = producto.imagenUrl.trim();
            imgRuta = u.startsWith('http') ? u : `http://localhost:8080${u.startsWith('/') ? '' : '/'}${u}`;
        }

        // Crear el HTML de la tarjeta (Card) exactamente como tu diseño
        const tarjetaHTML = `
            <div class="col">
                <div class="card h-100 border-0 shadow-sm text-center p-3" style="border-radius: 15px;">
                    <img src="${imgRuta}" class="card-img-top progress-img" style="height: 220px; object-fit: cover; border-radius: 12px;" alt="${producto.nombreProducto}">
                    <div class="card-body d-flex flex-column justify-content-between px-1">
                        <div>
                            <h5 class="card-title fw-bold mt-2" style="font-size: 1.1rem;">${producto.nombreProducto}</h5>
                            <p class="card-text text-muted small px-2" style="height: 40px; overflow: hidden; text-overflow: ellipsis;">
                                ${producto.descripcionProducto || "Mueble artesanal de diseño exclusivo."}
                            </p>
                            <p class="text-dark fw-bold fs-5 mb-3">$${producto.precio.toLocaleString('es-MX')}.00 MXN</p>
                        </div>
                        <div class="d-flex gap-2 justify-content-center mt-auto">
                            <a href="/pages/detalle-producto.html?id=${producto.idProducto}" class="btn btn-outline-dark btn-sm rounded-pill px-3" style="font-size: 0.85rem;">
                                <i class="bi bi-eye"></i> Ver
                            </a>
                            <button class="btn btn-gold btn-sm rounded-pill px-3 text-white" style="font-size: 0.85rem;" 
                                onclick="agregarAlCarritoDesdeCatalogo(${producto.idProducto}, '${producto.nombreProducto.replace(/'/g, "\\'")}', ${producto.precio}, '${imgRuta}')">
                                <i class="bi bi-cart-plus"></i> Agregar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Clasificación por categorías en base a tu diseño de la vista principal
        if (producto.categoria?.idCategoria === 1 || producto.categoria?.nombreCategoria?.toLowerCase().includes("silla")) {
            if (contenedorSillas) contenedorSillas.innerHTML += tarjetaHTML;
        } else if (producto.categoria?.idCategoria === 2 || producto.categoria?.nombreCategoria?.toLowerCase().includes("mesa")) {
            if (contenedorMesas) contenedorMesas.innerHTML += tarjetaHTML;
        } else {
            // Si no entra en las anteriores o usas un contenedor unificado
            if (contenedorGlobal) contenedorGlobal.innerHTML += tarjetaHTML;
            else if (contenedorSillas) contenedorSillas.innerHTML += tarjetaHTML; // Respaldo
        }
    });
}

// 🛒 LOGICA DE INYECCIÓN DIRECTA PARA CARRITO.JS DESDE EL CATALOGO
function agregarAlCarritoDesdeCatalogo(id, nombre, precio, imagen) {
    console.log(`🛒 Procesando clic de agregado rápido: ${nombre} (ID: ${id})`);

    // Estructura limpia y empaquetada que espera tu carrito.js original
    const productoParaCarrito = {
        id: parseInt(id, 10),
        nombre: nombre,
        precio: parseInt(precio, 10),
        imagen: imagen,
        descripcion: "",
        link: `/pages/detalle-producto.html?id=${id}`
    };

    // Validar si la función de scripts/carrito.js está montada en la ventana global
    if (typeof agregarProducto === 'function') {
        // Agrega 1 unidad de forma directa
        agregarProducto(productoParaCarrito);
        
        // Si tu mini-carrito del navbar se renderiza solo, lo disparamos
        if (typeof renderMiniCarrito === 'function') {
            renderMiniCarrito();
        }
        
        // Desplegar confirmación visual al usuario
        if (typeof mostrarToastEstetico === 'function') {
            mostrarToastEstetico(`¡${nombre} añadido al carrito! 🎉`, "success");
        } else {
            alert(`¡${nombre} añadido al carrito! 🎉`);
        }
    } else {
        console.error("❌ Error crítico: La función 'agregarProducto' no está disponible en esta página. Revisa que carrito.js esté cargado en el HTML.");
    }
}
