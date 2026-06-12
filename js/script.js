document.addEventListener("DOMContentLoaded", function() {
    const btnHamburguesa = document.getElementById('btnHamburguesa');
    const menuPrincipal = document.getElementById('menuPrincipal');
    const fondoMenu = document.getElementById('fondoMenu');
    
    if(btnHamburguesa && menuPrincipal && fondoMenu) {
        function toggleMenu() {
            menuPrincipal.classList.toggle('activo');
            fondoMenu.classList.toggle('activo');
            const icono = btnHamburguesa.querySelector('i');
            if(menuPrincipal.classList.contains('activo')) {
                icono.classList.remove('bi-list');
                icono.classList.add('bi-x-lg');
            } else {
                icono.classList.remove('bi-x-lg');
                icono.classList.add('bi-list');
            }
        }
        btnHamburguesa.addEventListener('click', toggleMenu);
        fondoMenu.addEventListener('click', toggleMenu);
    }
});

function scrollCarousel(containerId, direction) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const card = container.querySelector('.card');
    const cardWidth = card ? card.offsetWidth + 24 : 300;
    container.scrollBy({
        left: direction * cardWidth,
        behavior: 'smooth'
    });
}