const API_URL = "http://localhost:8080/api/productos";

        const imageInput = document.getElementById('image-input');
        const uploadZone = document.getElementById('upload-zone');
        const uploadPlaceholder = document.getElementById('upload-placeholder');
        const imagePreview = document.getElementById('image-preview');
        const furnitureForm = document.getElementById('furniture-form');

        // Zona de arrastre / clic de imagen 
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
// Guardar Mueble mapeando correctamente las relaciones
        furnitureForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const categoriaSelect = document.getElementById('furniture-category');
            const idCategoriaSeleccionada = parseInt(categoriaSelect.value, 10);
            if (!idCategoriaSeleccionada || isNaN(idCategoriaSeleccionada)) {
                alert('Por favor, selecciona una categoría válida de la lista.');
                return;
            }

            // Construcción del objeto con la categoría dinámica
            const datosNuevoMueble = {
                codigoProducto: document.getElementById('furniture-code').value || "MUE-GENERICO",
                nombreProducto: document.getElementById('furniture-name').value,
                precio: parseFloat(document.getElementById('furniture-price').value),
                stock: parseInt(document.getElementById('furniture-stock').value, 10),
                descripcionProducto: document.getElementById('furniture-description').value,
                detallesProducto: "Acabado estándar de fábrica",
                
                altoCm: 0.0,
                anchoCm: 0.0,
                profundidadCm: 0.0,
                pesoKg: 0.0,
                informacionAdicional: "Ninguna",
                categoria: {
                    idCategoria: idCategoriaSeleccionada
                },
                color: {
                    idColor: 1
                },
                material: {
                    idMaterial: 1 
                }
            };

            // Log de control para que verifiques en la consola del navegador qué ID se está enviando antes del fetch
            console.log("Despachando producto con Categoría ID:", idCategoriaSeleccionada);
            console.log("Payload final:", JSON.stringify(datosNuevoMueble));

            try {
                const respuesta = await fetch(API_URL, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    },
                    body: JSON.stringify(datosNuevoMueble)
                });

                if (respuesta.ok) {
                    alert('¡Mueble registrado exitosamente!');
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

