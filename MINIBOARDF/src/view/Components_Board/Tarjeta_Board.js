export function Tarjeta_Board(tid,titulo,Espectador) {
    const root = document.createElement("div")
    const content = document.createElement("div")



    root.dataset.tid = tid
    root.classList = "tarjeta-kanban my-3 w-100 p-2 rounded bg-danger text-white"

    content.innerHTML += `
    <div class="titulo-tarjeta-kanban fw-bold">${titulo}</div>
    <div class="contenido-tarjeta-kanban w-100 d-flex flex-wrap">

	  <div class="w-100">Responsable</div>

      <div class="w-50">Imagen...</div>

      <div class="w-50 text-end ${Espectador?"d-none":""}">
       <div class="ms-auto dropdown">
         <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class=" bi bi-three-dots dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false" viewBox="0 0 16 16">
            <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3"></path>
         </svg>

         <ul class="dropdown-menu dropdown-menu-dark">
		   <li class="dropdown-item ">Cambiar nombre</li>
		   <li class="dropdown-item "> Cambiar color</li>

		   <li>
			 <hr class="dropdown-divider">
		   </li>
		   <li><a class="dropdown-item text-danger" href="#">Eliminar tarjeta</a></li>
         </ul>

		</div>
      </div>
    </div>`
    
    



}