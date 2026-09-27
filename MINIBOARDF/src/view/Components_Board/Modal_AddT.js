/**
 * modal con formulario para añadir una tarjeta a una columna 
 * extrae el cid desde el botón.
 * 
 * @param {Object} props - callbacks para acciones de eventos
 * @returns {Object} {render}
 */
export function Modal_Add_Tarjeta(props) {
  const root = document.createElement("div")
  const form = document.createElement("form")
  root.className = "modal fade"
  root.id = "AddTarjetaModal"
  root.setAttribute('tabindex', '-1');
  root.setAttribute('aria-labelledby', 'exampleModalLabel');
  root.setAttribute('aria-hidden', 'true');
  form.innerHTML = `         
              <label for="recipient-name" class="col-form-label d-block">Nombre Tarjeta:</label>
              <div class="d-flex flex-row justify-content-between mb-3 tar-inputs">
           
                <input id="NombreAddT" type="text" class="form-control input-tar-name" id="recipient-name">
                <input id="colorAddT" class="ms-auto input-tar-color" type="color">
           
                </div>

              <div class="mb-3">

                <label for="message-text" class="col-form-label">Contenido:</label>
                <textarea class="form-control" id="message-AddT"></textarea>

              </div>
            `
  form.id="Form-AddT"

  root.innerHTML = `
    <div class="modal-dialog  modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="exampleModalLabel">New message</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">

        </div>
        <div class="modal-footer">
          <button type="submit" form="Form-AddT" class="btn btn-primary">Crear Tarjeta</button>
        </div>
      </div>
    </div>`

  root.querySelector(".modal-body").appendChild(form)


  root.addEventListener('show.bs.modal', event => {
    form.reset()
    // Button that triggered the modal
    const button = event.relatedTarget
    const cid = button.dataset.bsCid
    const columna = button.closest('.columna-kanban')
    const titulo = columna.querySelector('.titulo-Board').value
    form.dataset.cid = cid;

    const modalTitle = root.querySelector('.modal-title')


    modalTitle.textContent = `Agregar tarjeta a ` + titulo
  })

  form.addEventListener('submit',(e)=>{
    e.preventDefault();
    props.onCreateTar(e,GetFormData())
  })


  const GetFormData=()=> {
    return {
      cid: form.dataset.cid,
      titulo: form.querySelector('#NombreAddT').value,
      color: form.querySelector('#colorAddT').value,
      contenido: form.querySelector('#message-AddT').value
    };
  }


  const render = (container) => {
    container.appendChild(root)
  }

  return { render }
}