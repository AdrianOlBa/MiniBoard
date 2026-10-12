/**
 * Crea la interfaz necesaria para visualizar y gestionar las invitaciones pendientes.
 * Genera un botón flotante con un modal emergente y la lista de invitaciones.
 * 
 * @param {Object} props - callbacks para los eventos de la interfaz
 * @returns {Object} { boton, modal, render, setInvitaciones }
 */
export function Invitaciones_Button_Home(props = {}) {
    const boton = document.createElement("div");
    const modal = document.createElement("div");


    boton.id = 'invitaciones-Btn';
    boton.className = ' rounded-circle d-flex align-items-center justify-content-center shadow-lg position-fixed';

    boton.dataset.bsToggle = 'modal';
    boton.dataset.bsTarget = '#Modal-Invitaciones';
    boton.title = 'Ver invitaciones';


    boton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor" class="bi bi-envelope-open" viewBox="0 0 16 16">
            <path d="M8.47 1.318a1 1 0 0 0-.94 0l-6 3.2A1 1 0 0 0 1 5.4v.817l5.75 3.45L8 8.917l1.25.75L15 6.217V5.4a1 1 0 0 0-.53-.882zM15 7.383l-4.778 2.867L15 13.117zm-.001 6.88L8 9.882l-6.999 4.381A1 1 0 0 0 2 15h12a1 1 0 0 0 .999-.737M1 13.116l4.778-2.867L1 7.383zm-.022-7.857a1 1 0 0 0 0 .002"/>
        </svg>
    `;

    modal.className = 'modal fade';
    modal.id = 'Modal-Invitaciones';
    modal.tabIndex = -1;
    modal.setAttribute('aria-labelledby', 'ModalInvitacionesLabel');
    modal.setAttribute('aria-hidden', 'true');

    modal.innerHTML = `
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="ModalInvitacionesLabel">Invitaciones Pendientes</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body p-0">
                    <ul class="list-group list-group-flush" id="Lista-Invitaciones">
                       
                    </ul>
                </div>
            </div>
        </div>
    `;

    const listaInvitaciones = modal.querySelector("#Lista-Invitaciones");



    modal.addEventListener('show.bs.modal', async (e) => {

        let listaArray = await props.listaInvitaciones()
        console.log(listaArray)

        if (listaArray.length === 0) {
            listaInvitaciones.innerHTML = `
                <li class="list-group-item d-flex align-items-center justify-content-center p-3">
                    <span>No hay invitaciones pendientes</span>
                </li>
            `;
            return;
        }

        listaInvitaciones.innerHTML = "";


        listaArray.forEach((inv) => {
            const item = document.createElement("li");
            item.className = "list-group-item d-flex align-items-center justify-content-between p-3";

            item.innerHTML = `
                <div class="me-2">
                    <h6 class="mb-1 fw-bold text-break">${inv.did_diagrama.dnombre || 'Diagrama sin nombre'}</h6>
                    <p class="text-muted small mb-0">
                     Rol asignado: <strong class="text fw-semibold">${inv.iid_invitacion.rol || 'Espectador'}</strong>
                    </p>
                </div>
                <div class="btn-group btn-group-sm ms-auto flex-shrink-0 gap-2" role="group">
                    <button type="button" class="btn btn-success btn-aceptar" data-rol="${inv.iid_invitacion.rol || 'Espectador'}" data-iid="${inv.iid}">Aceptar</button>
                    <button type="button" class="btn btn-danger btn-rechazar" data-iid="${inv.iid}">Rechazar</button>
                </div>
            `;


            listaInvitaciones.appendChild(item);
        });



    })

    listaInvitaciones.addEventListener("click", async (e) => {
        const btnAceptar = e.target.closest(".btn-aceptar");
        const btnRechazar = e.target.closest(".btn-rechazar");
        let respuesta = {}
        console.log(btnAceptar, btnRechazar)
        if (!btnAceptar && !btnRechazar) return;

        const btnTarget = btnAceptar || btnRechazar;
        const iid = btnTarget.dataset.iid;
        const itemLi = btnTarget.closest("li");

        if (btnAceptar) {
            respuesta = await props.onAccept({ iid });

        } else if (btnRechazar) {
            respuesta = await props.onReject({ iid });
        }
        console.log(respuesta)

        if (respuesta.ok) {
            itemLi.remove();
            if (btnAceptar) {
                props.Badd({ did: respuesta.did, dnombre: respuesta.dnombre, es_favorito: false, rnombre: btnTarget.dataset.rol, color: respuesta.color })
            }
        }


    });



    /**
     * Renderiza los componentes dentro del contenedor padre
     * @param {HTMLElement} container 
     */
    const render = (container) => {
        container.appendChild(boton);
        container.appendChild(modal);
    };

    return {
        boton,
        modal,
        render
    };
}