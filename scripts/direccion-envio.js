document.addEventListener("DOMContentLoaded", () => {
    const formDireccion = document.getElementById("formDireccion");
    if (formDireccion) {
        formDireccion.addEventListener("submit", (e) => {
            e.preventDefault();
            
            // Guardamos las entradas del usuario en el localStorage
            localStorage.setItem("checkout_nombre", document.getElementById("nombreCompleto").value);
            localStorage.setItem("checkout_direccion", document.getElementById("direccion").value);
            localStorage.setItem("checkout_ciudad", document.getElementById("ciudad").value);
            localStorage.setItem("checkout_cp", document.getElementById("codigoPostal").value);
            localStorage.setItem("checkout_estado", document.getElementById("estado").value);
            
            window.location.href = "./forma-pago.html";
        });
    }
});
// =========================================
//  DIRECCIÓN DE ENVÍO - LÓGICA COMPLETA
// =========================================

// Menú hamburguesa
function initMenuHamburguesa() {
    const btnHamburguesa = document.getElementById('btnHamburguesa');
    const menuPrincipal = document.getElementById('menuPrincipal');
    const fondoMenu = document.getElementById('fondoMenu');

    if (btnHamburguesa && menuPrincipal && fondoMenu) {
        btnHamburguesa.addEventListener('click', () => {
            menuPrincipal.classList.toggle('activo');
            fondoMenu.classList.toggle('activo');
            document.body.style.overflow = menuPrincipal.classList.contains('activo') ? 'hidden' : '';
        });
        
        fondoMenu.addEventListener('click', () => {
            menuPrincipal.classList.remove('activo');
            fondoMenu.classList.remove('activo');
            document.body.style.overflow = '';
        });
    }
}

// Cargar datos guardados previamente
function cargarDatosGuardados() {
    const datosGuardados = localStorage.getItem('datosEnvio');
    if (datosGuardados) {
        const datos = JSON.parse(datosGuardados);
        document.getElementById('nombreCompleto').value = datos.nombreCompleto || '';
        document.getElementById('direccion').value = datos.direccion || '';
        document.getElementById('ciudad').value = datos.ciudad || '';
        document.getElementById('codigoPostal').value = datos.codigoPostal || '';
        document.getElementById('estado').value = datos.estado || '';
        if (datos.pais) document.getElementById('pais').value = datos.pais;
        document.getElementById('telefono').value = datos.telefono || '';
        document.getElementById('instrucciones').value = datos.instrucciones || '';
    }
}

// Validar y guardar
function validarYGuardar(e) {
    e.preventDefault();
    
    const nombre = document.getElementById('nombreCompleto').value.trim();
    const direccion = document.getElementById('direccion').value.trim();
    const ciudad = document.getElementById('ciudad').value.trim();
    const cp = document.getElementById('codigoPostal').value.trim();
    const estado = document.getElementById('estado').value.trim();
    const pais = document.getElementById('pais').value;
    const telefono = document.getElementById('telefono').value.trim();
    
    if (!nombre || !direccion || !ciudad || !cp || !estado || !pais || !telefono) {
        alert('❌ Por favor, completa todos los campos obligatorios.');
        return;
    }
    
    if (!/^\d{5}$/.test(cp)) {
        alert('❌ El código postal debe tener 5 dígitos numéricos.');
        return;
    }
    
    if (telefono.length < 8) {
        alert('❌ Ingresa un número de teléfono válido (mínimo 8 dígitos).');
        return;
    }
    
    const datosEnvio = {
        nombreCompleto: nombre,
        direccion: direccion,
        ciudad: ciudad,
        codigoPostal: cp,
        estado: estado,
        pais: pais,
        telefono: telefono,
        instrucciones: document.getElementById('instrucciones').value.trim()
    };
    
    localStorage.setItem('datosEnvio', JSON.stringify(datosEnvio));
    window.location.href = '/pages/forma-pago.html';
}

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    initMenuHamburguesa();
    cargarDatosGuardados();
    document.getElementById('formDireccion').addEventListener('submit', validarYGuardar);
});
