// Endpoint real de tu API REST en Spring Boot
const API_URL = "http://localhost:8080/api/productos";

// Este evento se dispara automáticamente al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    renderizarDashboardReal();

    // Escuchar el envío del formulario de edición
    document.getElementById('edit-form').addEventListener('submit', actualizarProducto);
});

async function renderizarDashboardReal() {
    const tableBody = document.getElementById('inventory-table-body');
    const totalMueblesEl = document.getElementById('total-muebles');
    const totalCategoriasEl = document.getElementById('total-categorias');

    try {
        const respuesta = await fetch(API_URL);
        if (!respuesta.ok) throw new Error("No se pudo conectar con el servidor backend.");

        const muebles = await respuesta.json();
        tableBody.innerHTML = '';
        
        if (!muebles || muebles.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 20px; color: #666;">No hay muebles registrados en la base de datos.</td></tr>`;
            totalMueblesEl.textContent = '0';
            totalCategoriasEl.textContent = '0';
            return;
        }

        let categoriasUnicas = new Set();
        
        muebles.forEach(mueble => {
            const nombreCategoria = mueble.categoria ? (mueble.categoria.nombreCategoria || mueble.categoria.nombre) : "Sin Categoría";
            if (mueble.categoria && (mueble.categoria.nombreCategoria || mueble.categoria.nombre)) {
                categoriasUnicas.add((mueble.categoria.nombreCategoria || mueble.categoria.nombre).toLowerCase());
            }
            
            const idReal = mueble.idProducto || mueble.id;
            const nombreEscapado = mueble.nombreProducto.replace(/'/g, "\\'");

            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td><strong>${mueble.codigoProducto || 'S/C'}</strong></td>
                <td>${mueble.nombreProducto}</td>
                <td><span class="badge" style="background: #e1f5fe; color: #0288d1; padding: 4px 8px; border-radius: 4px; font-size: 0.85em; font-weight: bold; text-transform: uppercase;">${nombreCategoria}</span></td>
                <td>$${mueble.precio.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                <td>${mueble.stock} pzas</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-action edit" title="Editar" style="margin-right: 5px; cursor: pointer; background: none; border: none; color: #3498db;" onclick="abrirModalEditar(${idReal}, '${nombreEscapado}', ${mueble.precio}, ${mueble.stock})"><i class="fa-solid fa-pen"></i></button>
                        <button class="btn-action delete" title="Eliminar" style="cursor: pointer; background: none; border: none; color: #e74c3c;" onclick="eliminarProducto(${idReal}, '${nombreEscapado}')"><i class="fa-solid fa-trash"></i></button>
                    </div>
                </td>
            `;
            tableBody.appendChild(fila);
        });

        totalMueblesEl.textContent = muebles.length;
        totalCategoriasEl.textContent = categoriasUnicas.size;

    } catch (error) {
        console.error("Error al renderizar el Dashboard:", error);
        tableBody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 20px; color: #e74c3c; font-weight: bold;">⚠️ Error de conexión con el Backend.</td></tr>`;
    }
}

// --- FUNCIONES PARA LA MODAL DE EDICIÓN ---

// Agrega los datos actuales del mueble a los inputs y despliega la modal
function abrirModalEditar(id, nombre, precio, stock) {
    document.getElementById('edit-id').value = id;
    document.getElementById('edit-nombre').value = nombre;
    document.getElementById('edit-precio').value = precio;
    document.getElementById('edit-stock').value = stock;

    // Cambia el display a 'flex' para que se muestre centrada en pantalla
    document.getElementById('editModal').style.display = 'flex';
}

// Oculta la modal de la pantalla
function cerrarModal() {
    document.getElementById('editModal').style.display = 'none';
}

// Petición HTTP PUT al backend para guardar los cambios
async function actualizarProducto(e) {
    e.preventDefault(); // Evitar recarga de página por el formulario

    const id = document.getElementById('edit-id').value;
    
    try {
        // 1. Traemos primero el producto completo y original desde el backend
        const respuestaOriginal = await fetch(`${API_URL}/${id}`);
        if (!respuestaOriginal.ok) throw new Error("No se pudo obtener el producto original.");
        
        const producto = await respuestaOriginal.json();

        // 2. Sobrescribimos ÚNICAMENTE los campos que modificó el admin en la modal
        producto.nombreProducto = document.getElementById('edit-nombre').value;
        producto.precio = parseFloat(document.getElementById('edit-precio').value);
        producto.stock = parseInt(document.getElementById('edit-stock').value);

        // 3. Enviamos el objeto 'producto' completo (manteniendo intactas sus categorías, materiales, etc.)
        const respuestaPut = await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(producto) // Conserva toda la estructura que espera tu @PutMapping
        });

        if (respuestaPut.ok) {
            alert("¡Mueble actualizado correctamente!");
            cerrarModal();
            renderizarDashboardReal(); // Refrescar la tabla al instante
        } else {
            alert(`Error al actualizar el producto (Código: ${respuestaPut.status}).`);
        }
    } catch (error) {
        console.error("Error al enviar la actualización:", error);
        alert("No se pudo conectar con el servidor para guardar los cambios.");
    }
}     

// --- FUNCIÓN PARA ELIMINAR ---
async function eliminarProducto(id, nombre) {
    const confirmar = confirm(`¿Estás seguro de que deseas eliminar permanentemente "${nombre}" del inventario?`);
    if (!confirmar) return;

    try {
        const respuesta = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        if (respuesta.ok) {
            alert(`¡"${nombre}" ha sido eliminado exitosamente!`);
            renderizarDashboardReal();
        } else {
            alert("El servidor no pudo eliminar el producto.");
        }
    } catch (error) {
        alert("Hubo un problema de conexión para eliminar el registro.");
    }
}
