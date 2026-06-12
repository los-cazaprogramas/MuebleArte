const API_URL = "http://localhost:8080/api/productos";

const imageInput = document.getElementById('image-input');
const uploadZone = document.getElementById('upload-zone');
const uploadPlaceholder = document.getElementById('upload-placeholder');
const imagePreview = document.getElementById('image-preview');
const furnitureForm = document.getElementById('furniture-form');

// 1. Zona de clic/selección de imagen (Tu lógica impecable)
uploadZone.addEventListener('click', () => {
    imageInput.click();
});

imageInput.addEventListener('change', function() {
    const file = this.files[0];
    if (file) {
        const reader = new FileReader();
        reader.addEventListener('load', function() {
            uploadPlaceholder.style.display = 'none';
            imagePreview.src = this.result;
            imagePreview.style.display = 'block';
        });
        reader.readAsDataURL(file);
    }
});

// 2. Guardar Mueble enviando los campos y la imagen física mediante FormData
furnitureForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const categoriaSelect = document.getElementById('furniture-category');
    const idCategoriaSeleccionada = parseInt(categoriaSelect.value, 10);
    if (!idCategoriaSeleccionada || isNaN(idCategoriaSeleccionada)) {
        alert('Por favor, selecciona una categoría válida de la lista.');
        return;
    }

    // --- INSTANCIAMOS EL OBJETO MULTIPART ---
    const formData = new FormData();

    // Mapeamos los datos de los inputs según sus IDs en nuevo-mueble.html
    formData.append("nombreProducto", document.getElementById('furniture-name').value);
    formData.append("precio", parseFloat(document.getElementById('furniture-price').value));
    formData.append("stock", parseInt(document.getElementById('furniture-stock').value, 10));
    formData.append("codigoProducto", document.getElementById('furniture-code').value || "MUE-GENERICO");
    formData.append("descripcionProducto", document.getElementById('furniture-description').value);
    
    // Valores por defecto para campos requeridos por tu BD
    formData.append("detallesProducto", "Acabado estándar de fábrica");
    formData.append("altoCm", 0.0);
    formData.append("anchoCm", 0.0);
    formData.append("profundidadCm", 0.0);
    formData.append("pesoKg", 0.0);
    formData.append("informacionAdicional", "Ninguna");

    // Relaciones mapeadas en Spring Boot (usando la notación de puntos)
    formData.append("categoria.idCategoria", idCategoriaSeleccionada);
    formData.append("color.idColor", 1);
    formData.append("material.idMaterial", 1);

    // --- CAPTURAMOS EL ARCHIVO BINARIO DE LA IMAGEN ---
    // "imagen" coincide exactamente con el @RequestParam(value = "imagen") de Java
    if (imageInput.files.length > 0) {
        formData.append("imagen", imageInput.files[0]);
    }

    // Control de depuración en la consola del navegador
    console.log("Despachando formulario Multipart hacia Spring Boot...");

    try {
        const respuesta = await fetch(API_URL, {
            method: "POST",
            body: formData
            // ⚠️ IMPORTANTE: No se agregan Headers de 'Content-Type'. 
            // El navegador se encarga de asignar 'multipart/form-data' automáticamente.
        });

        if (respuesta.ok) {
            alert('¡Mueble e imagen registrados exitosamente de forma local!');
            window.location.href = "index.html";
        } else {
            const textoError = await respuesta.text();
            console.error("Error devuelto por el backend:", textoError);
            alert(`El servidor rechazó la solicitud (Código: ${respuesta.status}). Revisa la consola.`);
        }
    } catch (error) {
        console.error("Error de red o caída del servidor:", error);
        alert("No se pudo conectar con el servidor. Verifica que Spring Boot esté corriendo.");
    }
});
