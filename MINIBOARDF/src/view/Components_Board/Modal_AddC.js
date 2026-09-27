/**
 * Elemento modal con formulario para añadir una nueva columna al tablero.
 * 
 * @param {Object} props - callbacks para acciones en eventos
 * @returns {Object} `{ modal: HTMLElement, render: Function }`.
 */
export function Modal_Add_Column(props) {
    const modal = document.createElement("div")
    const Form = document.createElement("form")
    modal.className = 'modal fade';
    modal.id = 'Modal-Add';
    modal.tabIndex = -1;
    modal.setAttribute('aria-labelledby', 'ModalAddLabel');
    modal.setAttribute('aria-hidden', 'true');

    modal.innerHTML = `<div class="modal-dialog modal-dialog-centered">
						<div class="modal-content">

							<div class="modal-header">
								<h1 class="modal-title fs-5" id="FormModalTittle">Modal title</h1>
								<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
							</div>

							<div class="modal-body" id="FormAddColumn">
							</div>
	
						</div>
					</div>`

    Form.innerHTML = `<div class="col-form d-flex flex-row justify-content-between mb-3">
						 <input type="text" class="input-col-name form-control" id="cnombre" name="nombre" placeholder="Nombre de la Columna">
				         <input type="color" class="input-col-color form-control" id="color" name="color" placeholder="Color de Columna"></div>
                        <button type="submit" class="btn btn-primary w-100">
							Crear Columna
						</button>`

    modal.appendChild(Form)

    modal.querySelector("#FormAddColumn").appendChild(Form)

    Form.addEventListener("submit", (e) => { e.preventDefault(); props.onCreateCol(e, GetData()) })

    const render = (container) => {
        container.innerHTML = `<div class="agregar-Columna bg-opacity-25 bg-dark-subtle rounded-2 d-flex flex-row align-items-center justify-content-center border border-secondary"  data-bs-toggle="modal" data-bs-target="#Modal-Add">
							<p class="m-0 mx-3">Agregar Columna</p>
							<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-plus-lg" viewBox="0 0 16 16">
								<path fill-rule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2"></path>
							</svg>
					</div>`
        container.appendChild(modal)
    }


    const GetData = () => {
        const color = Form.querySelector('#color').value || 'plcholder';
        const cnombre = Form.querySelector('#cnombre').value || 'plcholder';

        return { color, cnombre }
    }

    return { modal, render }

}