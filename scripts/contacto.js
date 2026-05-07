document.querySelector("body > div:nth-child(12)")

//--------ESTO ES PARA QUE LLEGUEN LOS CORREOS DEL FORMULARIO 

document.getElementById('contactoForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const url = "https://script.google.com/macros/s/AKfycbwceBuQEyoyKhvakQxgayJbfSzQeWrIGtXurYRvGim3t0KpGdAoGlhAgUWEv8L4AW7R0A/exec";

    const data = new FormData(this);

 try {
        await fetch(url, { 
            method: "POST", 
            body: data,
            mode: "no-cors"  // ← solo agrega esta línea
        });
        alert('¡Mensaje enviado! Nos pondremos en contacto contigo pronto.');
        this.reset();
    } catch (error) {
        alert('Hubo un error al enviar. Intenta de nuevo.');
    }
});