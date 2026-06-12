// =========================================
//  MENÚ HAMBURGUESA - SOLO PARA PASARELA DE PAGO
//  No afecta a otras páginas
// =========================================

function iniciarMenuPasarela() {
    const btn = document.getElementById('btnHamburguesa');
    const menu = document.getElementById('menuPrincipal');
    const fondo = document.getElementById('fondoMenu');

    if (!btn || !menu || !fondo) return;

    btn.addEventListener('click', function(e) {
        e.stopPropagation();
        menu.classList.toggle('activo');
        fondo.classList.toggle('activo');
        document.body.classList.toggle('pasarela-menu-abierto');
    });

    fondo.addEventListener('click', function() {
        menu.classList.remove('activo');
        fondo.classList.remove('activo');
        document.body.classList.remove('pasarela-menu-abierto');
    });

    document.querySelectorAll('#menuPrincipal a').forEach(enlace => {
        enlace.addEventListener('click', () => {
            menu.classList.remove('activo');
            fondo.classList.remove('activo');
            document.body.classList.remove('pasarela-menu-abierto');
        });
    });
}

document.addEventListener('DOMContentLoaded', iniciarMenuPasarela);
