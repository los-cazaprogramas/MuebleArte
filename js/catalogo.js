// Endpoint de tu API REST en Spring Boot
const API_URL_PRODUCTOS = CONFIG.API_PRODUCTOS_URL;

document.addEventListener('DOMContentLoaded', () => {
    cargarCatalogoPublico();
});

async function cargarCatalogoPublico() {
    // Mapeamos los ID de tus contenedores HTML existentes
    const carruselSillas = document.getElementById('sillasCarousel');
    const carruselMesas = document.getElementById('mesasCarousel');
    const carruselSillones = document.getElementById('sillonesCarousel');
    const carruselLibreros = document.getElementById('librerosCarousel');

    try {
        const respuesta = await fetch(API_URL_PRODUCTOS);
        if (!respuesta.ok) throw new Error("No se pudo obtener la lista de productos.");

        const muebles = await respuesta.json();

        // Limpiamos los contenedores por si acaso
        if(carruselSillas) carruselSillas.innerHTML = '';
        if(carruselMesas) carruselMesas.innerHTML = '';
        if(carruselSillones) carruselSillones.innerHTML = '';
        if(carruselLibreros) carruselLibreros.innerHTML = '';

        if (!muebles || muebles.length === 0) {
            const mensajeVacio = `<p style="padding: 20px; color: #7f8c8d; text-align:center; width:100%;">No hay productos disponibles por el momento.</p>`;
            if(carruselSillas) carruselSillas.innerHTML = mensajeVacio;
            return;
        }

        // Iterar los productos devueltos por la base de datos
        muebles.forEach(mueble => {
            // Evaluamos la categoría del producto (manejando minúsculas/mayúsculas para seguridad)
            const categoriaNombre = mueble.categoria ? (mueble.categoria.nombreCategoria || mueble.categoria.nombre || "").toLowerCase() : "";
            
            console.log("Datos del mueble recibido:", mueble);
            
            // Mapeo de la imagen de forma limpia
            let imagenOriginal = mueble.imagenUrl || mueble.urlImagen || mueble.imagen || mueble.rutaImagen || null;
            let urlImagen = "";
            
            if(!imagenOriginal){
                // Si no hay imagen en la BD, usamos un marcador de posición genérico bien diseñado
                urlImagen = "https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=600&auto=format&fit=crop";
            } else {
                // Si la ruta ya empieza con http, la usamos directa; si no, le concatenamos el servidor de Spring Boot
                urlImagen = imagenOriginal.startsWith('http') ? imagenOriginal : CONFIG.API_BASE_URL + (imagenOriginal.startsWith('/') ? imagenOriginal : '/' + imagenOriginal);
            }
            
            // Descripción del mueble y características
            const descripcion = mueble.descripcionProducto || (mueble.material ? mueble.material.nombreMaterial : "Diseño exclusivo");
            const idReal = mueble.idProducto || mueble.id;

            // Creamos la Card con la estructura exacta y clases de Bootstrap que ya maneja tu CSS
            const cardHtml = document.createElement('div');
            cardHtml.className = "card product-card";
            
            // Inyectamos exactamente tus mismos atributos 'data-' para que se acople perfectamente con tu script 'carrito.js'
            cardHtml.setAttribute('data-id', idReal);
            cardHtml.setAttribute('data-nombre', mueble.nombreProducto);
            cardHtml.setAttribute('data-precio', mueble.precio);
            cardHtml.setAttribute('data-imagen', urlImagen);
            cardHtml.setAttribute('data-descripcion', descripcion);

            // RENDERIZADO FINAL: Agregamos el enlace <a> alrededor de la imagen y un nuevo botón "Ver detalle"
            cardHtml.innerHTML = `
                <a href="/pages/detalle-producto.html?id=${idReal}">
                    <img src="${urlImagen}" class="card-img-top" alt="${mueble.nombreProducto}" style="height: 200px; object-fit: cover; cursor: pointer;">
                </a>
                <div class="card-body text-center d-flex flex-column justify-content-between">
                    <div>
                        <h5 class="card-title">${mueble.nombreProducto}</h5>
                        <p class="card-text" style="color: var(--texto-secundario); font-size: 0.9em;">${descripcion}</p>
                    </div>
                    <div>
                        <p class="fw-bold fs-5" style="color: var(--color-marino); margin-top: 10px;">$${mueble.precio.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN</p>
                        
                        <div class="d-flex gap-2 mt-2">
                            <a href="/pages/detalle-producto.html?id=${idReal}" class="btn btn-outline-secondary w-50 d-flex align-items-center justify-content-center" style="font-size: 0.85em;">
                                <i class="bi bi-eye"></i> Ver
                            </a>
                            <button class="btn btn-agregar w-50" 
                                    ${mueble.stock === 0 ? 'disabled style="background-color: #bdc3c7; border-color: #bdc3c7;"' : ''} 
                                    onclick="agregarProductoDesdeCard(this)" style="font-size: 0.85em;">
                                ${mueble.stock === 0 ? 'Agotado' : 'Agregar'}
                            </button>
                        </div>
                    </div>
                </div>
            `;

            // Clasificación por categoría inteligente: Inyecta la Card en el contenedor correspondiente
            if (categoriaNombre.includes("silla") && !categoriaNombre.includes("sillon")) {
                if (carruselSillas) carruselSillas.appendChild(cardHtml);
            } else if (categoriaNombre.includes("mesa")) {
                if (carruselMesas) carruselMesas.appendChild(cardHtml);
            } else if (categoriaNombre.includes("sillon")) {
                if (carruselSillones) carruselSillones.appendChild(cardHtml);
            } else if (categoriaNombre.includes("librero")) {
                if (carruselLibreros) carruselLibreros.appendChild(cardHtml);
            } else {
                if (carruselSillas) carruselSillas.appendChild(cardHtml);
            }
        });

    } catch (error) {
        console.error("Error cargando productos en el front de usuario:", error);
        const errorTemplate = `<p style="padding: 20px; color: #e74c3c; font-weight: bold; text-align:center; width:100%;">⚠️ Error de conexión con la galería de arte.</p>`;
        if(carruselSillas) carruselSillas.innerHTML = errorTemplate;
    }
}
