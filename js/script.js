document.addEventListener("DOMContentLoaded", function() {
    const btnHamburguesa = document.getElementById('btnHamburguesa');
    const menuPrincipal = document.getElementById('menuPrincipal');
    const fondoMenu = document.getElementById('fondoMenu'); // Llamamos al nuevo fondo
    
    if(btnHamburguesa && menuPrincipal && fondoMenu) {
        
        // Función para abrir/cerrar el menú
        function toggleMenu() {
            menuPrincipal.classList.toggle('activo');
            fondoMenu.classList.toggle('activo'); // Alterna el fondo oscuro
            
            // Cambia el ícono de hamburguesa a la "X"
            const icono = btnHamburguesa.querySelector('i');
            if(menuPrincipal.classList.contains('activo')) {
                icono.classList.remove('bi-list');
                icono.classList.add('bi-x-lg');
            } else {
                icono.classList.remove('bi-x-lg');
                icono.classList.add('bi-list');
            }
        }

        // Evento al tocar el botón hamburguesa
        btnHamburguesa.addEventListener('click', toggleMenu);
        
        // Evento al tocar el fondo oscuro (para cerrar el menú)
        fondoMenu.addEventListener('click', toggleMenu);
    }
});