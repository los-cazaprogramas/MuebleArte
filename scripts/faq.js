/* =========================================
   FAQ MUEBLEARTE
   Acordeón premium
   - Una pregunta abierta a la vez
   - Apertura/cierre suave
   - Accesible
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    const faqItems = document.querySelectorAll(".faq-item");

    faqItems.forEach((item) => {

        const question = item.querySelector(".faq-question");
        const answer = item.querySelector(".faq-answer");

        // Accesibilidad
        question.setAttribute("aria-expanded", "false");

        // Si existe una activa desde HTML
        if (item.classList.contains("active")) {
            answer.style.maxHeight = answer.scrollHeight + "px";
            question.setAttribute("aria-expanded", "true");
        }

        question.addEventListener("click", () => {

            const isOpen = item.classList.contains("active");

            // Cerrar todos
            faqItems.forEach((faq) => {

                faq.classList.remove("active");

                const faqAnswer = faq.querySelector(".faq-answer");
                const faqQuestion = faq.querySelector(".faq-question");

                faqAnswer.style.maxHeight = null;
                faqQuestion.setAttribute("aria-expanded", "false");
            });

            // Abrir el seleccionado
            if (!isOpen) {

                item.classList.add("active");

                answer.style.maxHeight =
                    answer.scrollHeight + "px";

                question.setAttribute(
                    "aria-expanded",
                    "true"
                );
            }
        });
    });

    /* =====================================
       Recalcular altura en resize
    ===================================== */

    window.addEventListener("resize", () => {

        const activeItem =
            document.querySelector(".faq-item.active");

        if (!activeItem) return;

        const activeAnswer =
            activeItem.querySelector(".faq-answer");

        activeAnswer.style.maxHeight =
            activeAnswer.scrollHeight + "px";
    });

});