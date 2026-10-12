//serviria tambien tomar error de board modificarlo y hacerlo global pero...


/**
 * Crea una notificación flotante reutilizable.
 * Configura sus controles 
 * @returns {{render: Function, showNotification: Function, container: HTMLElement}} metodos y contenedor
 */
export function Notification() {
    let timeout = null;

    const container = document.createElement("div");
    container.className = "position-fixed top-0 end-0 p-3 d-none";
    container.style.zIndex = "1100";

    const alertBox = document.createElement("div");
    alertBox.className = "alert alert-dismissible fade show shadow-lg d-flex align-items-center m-0";
    alertBox.setAttribute("role", "alert");


    alertBox.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-exclamation-octagon-fill me-2 flex-shrink-0" viewBox="0 0 16 16">
            <path d="M11.46.146A.5.5 0 0 1 11.854.3L15.7 4.146c.105.106.164.25.164.398v5.586a.5.5 0 0 1-.164.398L11.854 15.7a.5.5 0 0 1-.398.164H4.54a.5.5 0 0 1-.398-.164L.146 11.854A.5.5 0 0 1 0 11.456V5.87a.5.5 0 0 1 .146-.398L4.146.146A.5.5 0 0 1 4.54 0h6.92a.5.5 0 0 1 .398.146zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 1 0 0-2z"/>
        </svg>
        <span class="error-msg-text"></span>
        <button type="button" class="btn-close ms-3" aria-label="Close"></button>
    `;

    const errorMsgSpan = alertBox.querySelector(".error-msg-text");
    const closeBtn = alertBox.querySelector(".btn-close");

    closeBtn.addEventListener("click", () => {
        container.classList.add("d-none");
        if (timeout) clearTimeout(timeout);
    });

    container.appendChild(alertBox);

    /**
     * Muestra la notificación de error con el mensaje especificado durante 3 segundos.
     * @param {string} mensaje Texto del error a mostrar
     */
    const showNotification = ({message, tipo}) => {
        alertBox.classList.remove("alert-danger", "alert-success");

        if (tipo == "error") {
            alertBox.classList.add("alert-danger");
        } else if (tipo == "success") {
            alertBox.classList.add("alert-success");
        }

        errorMsgSpan.textContent = message;
        container.classList.remove("d-none");


        if (timeout) clearTimeout(timeout);


        timeout = setTimeout(() => {
            container.classList.add("d-none");
        }, 3000);
    };


    /**
     * Inserta el contenedor de notificaciones en un elemento.
     * @param {HTMLElement} board Elemento donde se insertará el contenedor.
     * @returns {void}
     */
    const render = (board) => {
        console.log("render_Err")
        board.appendChild(container);
    };

    return {
        render,
        showNotification,
        container
    };
}

