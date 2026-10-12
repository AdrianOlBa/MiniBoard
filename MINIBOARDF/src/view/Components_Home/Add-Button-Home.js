/**
 * Crea la interfaz necesaria para agregar un nuevo tablero 
 * Genera un botón flotante con un modal emergente y un formulario
 * @param {Object} props - callbacks de eventos
 * @returns {Object} {boton,modal.render}
 */
export function Add_Button_Home(props) {
  const boton = document.createElement("div");
  const modal = document.createElement("div");
  const FormAdd = document.createElement("form")

  //datos del boton
  boton.id = 'agregar-Btn';
  boton.dataset.bsToggle = 'modal';
  boton.dataset.bsTarget = '#Modal-Add';
  boton.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-lg" viewBox="0 0 16 16">
      <path fill-rule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2"></path>
    </svg>`;


  //datos del modal
  modal.className = 'modal fade';
  modal.id = 'Modal-Add';
  modal.tabIndex = -1;
  modal.setAttribute('aria-labelledby', 'ModalAddLabel');
  modal.setAttribute('aria-hidden', 'true');


  //datos del formulario
  FormAdd.className = "p-4";
  FormAdd.innerHTML = `
      <div class="mb-3 d-flex gap-2 align-items-center">
        <input type="text" class="form-control" id="nombreInput" name="nombre" placeholder="Nombre del diagrama" required>
        <input type="color" class="form-control form-control-color input-color-square" id="colorInput" name="color" value="#563d7c" title="Selecciona un color">
      </div>
      <button type="submit" class="btn btn-primary w-100">
        Crear Diagrama
      </button>`;




  //modal emergente
  modal.innerHTML += `
                    <div class="modal-dialog modal-dialog-centered">
						<div class="modal-content">

							<div class="modal-header">
								<h1 class="modal-title fs-5" id="FormModalTittle">Agregar Board</h1>
								<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
							</div>

							<div class="modal-body" id="FormAddBody">
							</div>
	
						</div>
					</div>`


  modal.querySelector("#FormAddBody").appendChild(FormAdd);



  FormAdd.addEventListener("submit", async (event) => {
    event.preventDefault();
    let dnombre = document.getElementById("nombreInput").value
    let color = document.getElementById("colorInput").value
    FormAdd.reset()
    props.onAdd({ dnombre, color })
  })

  const render = (container) => {
    container.appendChild(boton)
    container.appendChild(modal)
  }


  return { boton, modal, render }
}