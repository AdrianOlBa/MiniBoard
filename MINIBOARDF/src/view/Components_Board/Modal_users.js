/**
 * Elemento de lista para un usuario
 * Añade la opción de eliminar solo para administradores
 * @param {Object} usuario Datos del usuario.
 * @param {string} rol Rol de quien consulta la lista.
 * @returns {HTMLElement} 
 */
function list_element(usuario, rol) {
    const elemento = document.createElement("li")
    elemento.className = "list-group-item d-flex justify-content-between align-items-center px-0"
    elemento.innerHTML = `
                            <span data-uid="${usuario.uid}">${usuario.nombre}</span>
                        `
    if (rol === "Administrador") {
        elemento.innerHTML += ` <button class="eliminar-usuario btn btn-outline-danger btn-sm" data-uid="${usuario.uid}">Eliminar</button>`
    }

    console.log(elemento)
    return elemento
}




/**
 * Construye el modal para consultar y gestionar usuarios.
 * @param {Object} props callbacks
 * @returns {Object} metodos del modal
 */
export function Modal_users(props) {

    let datos = {}

    const button = document.createElement("div");
    button.className = "lista-usuarios btn btn-primary rounded-circle d-flex align-items-center justify-content-center shadow-lg";
    button.setAttribute("data-bs-toggle", "modal");
    button.setAttribute("data-bs-target", "#Modal-Usuarios");
    button.setAttribute("aria-label", "Lista de usuarios");
    button.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" class="bi bi-person" viewBox="0 0 16 16">
            <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z"/>
        </svg>
    `;

    //Modal Lista de Usuarios
    const modal_users_list = document.createElement("div");
    modal_users_list.className = "modal fade";
    modal_users_list.id = "Modal-Usuarios";
    modal_users_list.setAttribute("tabindex", "-1");
    modal_users_list.setAttribute("aria-labelledby", "ModalUsuariosLabel");
    modal_users_list.setAttribute("aria-hidden", "true");
    modal_users_list.innerHTML = `
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header d-flex align-items-center">
                    <h1 class="modal-title fs-5 me-auto" id="ModalUsuariosLabel">Lista de usuarios</h1>
                    
                    <button type="button" class="button-agregar-us btn btn-sm btn-outline-primary me-2 d-flex align-items-center justify-content-center" data-bs-toggle="modal" data-bs-target="#Modal-Add-Usuario" title="Agregar usuario">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-add" viewBox="0 0 16 16">
                            <path d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7m.5-5v1h1a.5.5 0 0 1 0 1h-1v1a.5.5 0 0 1-1 0v-1h-1a.5.5 0 0 1 0-1h1v-1a.5.5 0 0 1 1 0m-2-6a3 3 0 1 1-6 0 3 3 0 0 1 6 0M8 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4"/>
                            <path d="M8.256 14a4.5 4.5 0 0 1-.229-1.004H3c.001-.246.154-.986.832-1.664C4.484 10.68 5.711 10 8 10q.39 0 .74.025c.226-.341.496-.65.804-.918Q8.844 9.002 8 9c-5 0-6 3-6 4s1 1 1 1z"/>
                        </svg>
                    </button>

                    <button type="button" class="btn-close ms-0" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <ul class="users-list list-group list-group-flush">

                    </ul>
                </div>
            </div>
        </div>
    `;

    /**
     * Actualiza la lista al abrir el modal
     */
    modal_users_list.addEventListener('show.bs.modal', async (event) => {
        let lista_usuarios = await props.lista_usuarios()
        if(datos.rol !== "Administrador"){
         modal_users_list.querySelector(".button-agregar-us").classList.add("d-none")}


        console.log(lista_usuarios)
        let lista_elemento = modal_users_list.querySelector(".users-list")
        lista_elemento.innerHTML = ""
        console.log(lista_elemento)
        if (lista_usuarios.ok) {

            for (let user of lista_usuarios.usuarios) {
                lista_elemento.appendChild(list_element(user, datos.rol))
            }

        }


    });



    const modal_Add_user = document.createElement("div");
    modal_Add_user.className = "modal fade";
    modal_Add_user.id = "Modal-Add-Usuario";
    modal_Add_user.setAttribute("tabindex", "-1");
    modal_Add_user.setAttribute("aria-labelledby", "ModalAddUsuarioLabel");
    modal_Add_user.setAttribute("aria-hidden", "true");

    const modalDialog = document.createElement("div");
    modalDialog.className = "modal-dialog modal-dialog-centered";

    const modalContent = document.createElement("div");
    modalContent.className = "modal-content";

    const modalHeader = document.createElement("div");
    modalHeader.className = "modal-header";
    modalHeader.innerHTML = `
        <h1 class="modal-title fs-5" id="ModalAddUsuarioLabel">Agregar nuevo usuario</h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
    `;

    const modalBody = document.createElement("div");
    modalBody.className = "modal-body";


    const formAddUser = document.createElement("form");
    formAddUser.id = "Form-Add-User";
    formAddUser.innerHTML = `
        <div class="mb-3">
            <label for="userEmail" class="form-label">Correo del usuario:</label>
            <input type="email" class="form-control" id="userEmail" placeholder="ejemplo@correo.com" required>
        </div>
        <div class="mb-3">
            <label for="userRol" class="form-label">Rol del usuario:</label>
            <select class="form-select" id="userRol" required>
                <option value="Espectador" >Espectador</option>
                <option value="Colaborador" selected>Colaborador</option>
                <option value="Administrador">Administrador</option>
            </select>
        </div>
        <button type="submit" class="btn btn-primary w-100">Enviar invitación</button>
    `;

    /**
     * Envia invitacion con datos del form
     */
    formAddUser.addEventListener("submit", (e) => {


            e.preventDefault();
            const correo = formAddUser.querySelector("#userEmail").value;
            const rol = formAddUser.querySelector("#userRol").value;

            props.onInvitacion({ correo, rol });
            formAddUser.reset();
        });

    modal_users_list.addEventListener('click', async (event) => {
        if (event.target.closest('.eliminar-usuario')) {
            const uid = event.target.closest('.eliminar-usuario').dataset.uid;
            let respuesta = await props.eliminar_usuario({ uid });
            console.log(respuesta)
            if(respuesta.ok){
                event.target.closest('.list-group-item').remove();
            }
        }
    })







    modalBody.appendChild(formAddUser);
    modalContent.appendChild(modalHeader);
    modalContent.appendChild(modalBody);
    modalDialog.appendChild(modalContent);
    modal_Add_user.appendChild(modalDialog);


    /**
     * Añade el botón y ambos modales al DOM.
     * @param {HTMLElement} container 
     */
    const render = (container) => {
        container.appendChild(button);
        container.appendChild(modal_users_list);
        container.appendChild(modal_Add_user);
    };

    /**
     * Configura el rol activo para la gestión de usuarios.
     * @param {Object} conf Configuración que contiene el rol.
     */
    const config = (conf) => {
        datos.rol = conf.rol
    }

    return {
        render,
        config,
        button,
        modal_users_list,
        modal_Add_user,
        formAddUser
    };
}