document.addEventListener("DOMContentLoaded", () => {
    const formPago = document.getElementById("formPago");
    if (formPago) {
        formPago.addEventListener("submit", (e) => {
            e.preventDefault();
            
            const tarjetaVal = document.getElementById("numTarjeta").value.replace(/\s+/g, '');
            const ultimosDigitos = tarjetaVal.slice(-4) || "4111"; // Toma los últimos 4 números
            
            localStorage.setItem("checkout_tarjeta", ultimosDigitos);
            
            window.location.href = "./confirmacion-pedido.html";
        });
    }
});
// =========================================
//  FORMA DE PAGO - LÓGICA Y VALIDACIONES
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

// Formatear número de tarjeta
function initFormateoTarjeta() {
    const numeroTarjeta = document.getElementById('numeroTarjeta');
    if (numeroTarjeta) {
        numeroTarjeta.addEventListener('input', (e) => {
            let valor = e.target.value.replace(/\D/g, '');
            if (valor.length > 16) valor = valor.slice(0, 16);
            valor = valor.replace(/(\d{4})(?=\d)/g, '$1 ');
            e.target.value = valor;
        });
    }
}

// Formatear fecha de expiración
function initFormateoFecha() {
    const fechaExpiracion = document.getElementById('fechaExpiracion');
    if (fechaExpiracion) {
        fechaExpiracion.addEventListener('input', (e) => {
            let valor = e.target.value.replace(/\D/g, '');
            if (valor.length >= 2) {
                valor = valor.slice(0, 2) + '/' + valor.slice(2, 4);
            }
            e.target.value = valor;
        });
    }
}

// Limitar CVV
function initLimiteCVV() {
    const cvv = document.getElementById('cvv');
    if (cvv) {
        cvv.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/\D/g, '').slice(0, 4);
        });
    }
}

// Cargar datos guardados
function cargarDatosPago() {
    const datosGuardados = localStorage.getItem('datosPago');
    if (datosGuardados) {
        const datos = JSON.parse(datosGuardados);
        if (datos.numeroTarjeta) {
            let num = datos.numeroTarjeta.replace(/(\d{4})(?=\d)/g, '$1 ');
            document.getElementById('numeroTarjeta').value = num;
        }
        document.getElementById('fechaExpiracion').value = datos.fechaExpiracion || '';
        document.getElementById('cvv').value = datos.cvv || '';
        document.getElementById('nombreTarjeta').value = datos.nombreTarjeta || '';
    }
}

// Validar y guardar
function validarYGuardar(e) {
    e.preventDefault();
    
    const numero = document.getElementById('numeroTarjeta').value.replace(/\s/g, '');
    const fecha = document.getElementById('fechaExpiracion').value;
    const cvvVal = document.getElementById('cvv').value;
    const nombre = document.getElementById('nombreTarjeta').value.trim();
    
    if (!/^\d{16}$/.test(numero)) {
        alert('❌ El número de tarjeta debe tener 16 dígitos.');
        return;
    }
    
    if (!/^(0[1-9]|1[0-2])\/(\d{2})$/.test(fecha)) {
        alert('❌ Formato de fecha inválido. Usa MM/AA (ej: 12/28)');
        return;
    }
    
    const [mes, anio] = fecha.split('/');
    const fechaActual = new Date();
    const anioActual = fechaActual.getFullYear() % 100;
    const mesActual = fechaActual.getMonth() + 1;
    const anioIngresado = parseInt(anio, 10);
    const mesIngresado = parseInt(mes, 10);
    
    if (anioIngresado < anioActual || (anioIngresado === anioActual && mesIngresado < mesActual)) {
        alert('❌ La tarjeta está vencida. Ingresa una fecha futura.');
        return;
    }
    
    if (!/^\d{3,4}$/.test(cvvVal)) {
        alert('❌ El CVV debe tener 3 o 4 dígitos.');
        return;
    }
    
    if (nombre.length < 3) {
        alert('❌ Ingresa el nombre completo como aparece en la tarjeta.');
        return;
    }
    
    const datosPago = {
        numeroTarjeta: numero,
        fechaExpiracion: fecha,
        cvv: cvvVal,
        nombreTarjeta: nombre
    };
    
    localStorage.setItem('datosPago', JSON.stringify(datosPago));
    window.location.href = '/pages/confirmacion-pedido.html';
}

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    initMenuHamburguesa();
    initFormateoTarjeta();
    initFormateoFecha();
    initLimiteCVV();
    cargarDatosPago();
    document.getElementById('formPago').addEventListener('submit', validarYGuardar);
});
