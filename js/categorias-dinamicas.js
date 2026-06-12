const URL_BASE_API = CONFIG.API_PRODUCTOS_URL;

const NOMBRES_CATEGORIAS = {
    1: "Sillas Artesanales",
    2: "Mesas Exclusivas",
    3: "Sillones Confort",
    4: "Libreros y Estantes",

};

document.addEventListener("DOMContentLoaded", () => {
    const parametrosUrl = new URLSearchParams(window.location.search);
    const idCategoria = parseInt(parametrosUrl.get("cat"), 10);

    const contenedor = document.getElementById("contenedor-muebles");
    const titulo = document.getElementById("titulo-categoria");

    if (!idCategoria || !contenedor) {
        if (titulo) titulo.textContent = "Categoría no encontrada";
        if (contenedor) contenedor.innerHTML = `<p class="text-danger text-center w-100">Error: No se especificó una categoría válida.</p>`;
        return;
    }

    if (titulo && NOMBRES_CATEGORIAS[idCategoria]) {
        titulo.textContent = NOMBRES_CATEGORIAS[idCategoria];
    }

    // Llamamos a la función correcta que filtra en Frontend
    cargarCatalogoFiltrado(idCategoria, contenedor);
});

async function cargarCatalogoFiltrado(idCategoria, contenedor) {
    try {
        // Consultamos al endpoint base que SÍ tiene @CrossOrigin (origins = "*")
        const respuesta = await fetch(URL_BASE_API);
        if (!respuesta.ok) throw new Error("No se pudo conectar con el catálogo de Spring Boot");

        const todosLosProductos = await respuesta.json();

        // Filtramos aquí para no depender de un endpoint inexistente en Java
        const productosFiltrados = todosLosProductos.filter(p => 
            p.categoria && p.categoria.idCategoria === idCategoria
        );

        contenedor.innerHTML = "";

        if (productosFiltrados.length === 0) {
            contenedor.innerHTML = `
                <div class="text-center w-100 py-5">
                    <i class="bi bi-folder-x fs-1 text-muted"></i>
                    <p class="text-muted mt-3">Por el momento no hay existencias en esta sección. ¡Pronto añadiremos más!</p>
                </div>`;
            return;
        }

        productosFiltrados.forEach(producto => {
            let imgRuta = "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=800&auto=format&fit=crop";
            if (producto.imagenUrl && producto.imagenUrl.trim() !== "") {
                const url = producto.imagenUrl.trim();
                imgRuta = url.startsWith('http') ? url : CONFIG.API_BASE_URL + (url.startsWith('/') ? url : '/' + url);
            }

            const precioFormateado = (producto.precio && typeof producto.precio === 'number') 
                ? producto.precio.toLocaleString('es-MX') 
                : '0';

            contenedor.innerHTML += `
                <div class="col">
                    <div class="card h-100 border-0 shadow-sm product-card" 
                         data-id="${producto.id}" 
                         data-id-producto="${producto.id}"
                         data-nombre="${producto.nombreProducto}" 
                         data-precio="${producto.precio}" 
                         data-imagen="${imgRuta}"
                         data-descripcion="${producto.descripcionProducto || ''}">
                        
                        <div class="position-relative overflow-hidden" style="height: 240px;">
                            <img src="${imgRuta}" class="card-img-top w-100 h-100" style="object-fit: cover;" alt="${producto.nombreProducto}" loading="lazy">
                        </div>
                        
                        <div class="card-body d-flex flex-column justify-content-between p-3">
                            <div>
                                <h5 class="card-title fw-bold text-dark mb-1" style="font-size: 1.1rem;">${producto.nombreProducto}</h5>
                                <p class="card-text text-muted text-truncate mb-2 small">${producto.descripcionProducto || 'Mueble de diseño exclusivo hecho a mano.'}</p>
                            </div>
                            
                            <div class="mt-2">
                                <div class="d-flex justify-content-between align-items-center mb-3">
                                    <span class="fs-5 fw-bold text-danger">$${precioFormateado}.00 MXN</span>
                                    <span class="badge ${producto.stock > 0 ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'} rounded-pill px-2" style="font-size: 0.75rem;">
                                        ${producto.stock > 0 ? 'Disponible' : 'Agotado'}
                                    </span>
                                </div>
                                
                                <div class="d-flex gap-2">
                                    <a href="detalle-producto.html?id=${producto.id}" class="btn btn-outline-dark btn-sm flex-grow-1 rounded-pill d-flex align-items-center justify-content-center gap-1">
                                         <i class="bi bi-eye"></i> Ver Detalle
                                    </a>
                                    <button class="btn btn-gold btn-sm rounded-pill px-3" onclick="agregarProductoDesdeCard(this)" ${producto.stock <= 0 ? 'disabled' : ''}>
                                        <i class="bi bi-cart-plus"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });

    } catch (error) {
        console.error("Error cargando los productos:", error);
        contenedor.innerHTML = `<p class="text-danger text-center w-100">Ocurrió un error al cargar el catálogo de productos.</p>`;
    }
}
