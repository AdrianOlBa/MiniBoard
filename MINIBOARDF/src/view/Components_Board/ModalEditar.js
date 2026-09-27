/**
 * Modal de edición de tarjetas.
 * @param {Object} props - callbacks para eventos
 * @returns {Object} 
 */
export function Modal_Editar(props) {
    const root = document.createElement("div");
    const form = document.createElement("form");

    root.className = "modal fade";
    root.id = "EditModal";
    root.setAttribute('tabindex', '-1');
    root.setAttribute('aria-labelledby', 'EditModalLabel');
    root.setAttribute('aria-hidden', 'true');

    form.id = "Form-Edit";
    form.innerHTML = `         
      <label for="NombreEditT" class="col-form-label d-block">Nombre Tarjeta:</label>
      <div class="d-flex flex-row justify-content-between mb-3 tar-inputs">
        <input id="NombreEditT" type="text" class="form-control input-tar-name" required>
        <input id="colorEditT" class="ms-auto input-tar-color" type="color">
      </div>

      <div class="mb-3">
        <label for="messageEditT" class="col-form-label">Contenido:</label>
        <textarea class="form-control" id="messageEditT"></textarea>
      </div>
    `;

    root.innerHTML = `
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="EditModalLabel">Editar Tarjeta</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body"></div>
        <div class="modal-footer">
          <button type="submit" form="Form-Edit" class="btn btn-primary" data-bs-dismiss="modal">Guardar Cambios</button>
        </div>
      </div>
    </div>`;

    root.querySelector(".modal-body").appendChild(form);

    // Convierte el valor de color del elemento a formato Hexadecimal para el input type="color"
    const toHex = (color) => {
        if (!color) return "#808080";
        const ctx = document.createElement("canvas").getContext("2d");
        ctx.fillStyle = color;
        return ctx.fillStyle;
    };

    root.addEventListener('show.bs.modal', async (event) => {
        form.reset();
        const button = event.relatedTarget;
        if (!button) return;

        // Búsqueda de la tarjeta y columna contenedoras en el DOM
        const tarjeta = button.closest(".tarjeta-kanban");
        const columna = button.closest(".columna-kanban");

        // Lectura directa desde el DOM
        const cid = columna ? columna.dataset.cid : "";
        const tid = tarjeta ? tarjeta.dataset.tid : "";
        const did = button.closest("#Board-Grid").dataset.did

        const titulo = tarjeta ? tarjeta.querySelector(".titulo-tarjeta-kanban")?.textContent.trim() : "";
        const color = tarjeta ? tarjeta.style.backgroundColor : "";

        // Guardar IDs en el dataset del formulario
        form.dataset.cid = cid;
        form.dataset.tid = tid;

        // Asignación directa usando los IDs exactos del HTML
        form.querySelector('#NombreEditT').value = titulo;
        form.querySelector('#colorEditT').value = toHex(color);
        form.querySelector('#messageEditT').value = (await props.Contenido_tar(tid)).contenido || "";
         console.log( (await props.Contenido_tar(tid)).contenido)

        // Título del modal
        root.querySelector('.modal-title').textContent = `Editar Tarjeta: ${titulo}`;
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        console.log(GetFormData())
        props.onEditT(e, GetFormData());

    });

    const GetFormData = () => {
        return {
            tid: form.dataset.tid,
            titulo: form.querySelector('#NombreEditT').value,
            color: form.querySelector('#colorEditT').value,
            contenido: form.querySelector('#messageEditT').value
        };
    };

    const render = (container) => {
        container.appendChild(root);
    };

    const destroy = () => {
        root.remove();
    };

    return { render, destroy };
}