

/**
 * Columna Kanban con sortablejs para el contenido
 * 
 * @param {Object} props - Callbacks para notificar cambios en los eventos
 * @param {Object} columna - Datos de la columna { cid, did, cnombre, color }.
 * @param {string} rol - Rol del usuario
 * @returns {Object} { root: HTMLElement, render: Function } Nodos del DOM y método de renderizado.
 */
export function Columna_Board(props, { cid, did, cnombre, color }, rol) {
    const root = document.createElement("div")
    const Header = document.createElement("div")
    const Content = document.createElement("div")
    let sortable

    root.className = "columna-kanban rounded-2 p-0 bg-body-tertiary border border-secondary mx-3"
    root.dataset.cid = cid
    Header.style.backgroundColor = color
    Header.className = "header-col w-100 text-white d-flex align-items-center px-3"
    Content.className = "content-col p-2 overflow-auto"

    root.appendChild(Header)
    root.appendChild(Content)



    Header.innerHTML += `
        <input class="titulo-Board fw-bold" value="${cnombre}">
       
       
        <div class="agregar-tarjeta mx-1" data-bs-toggle="modal" data-bs-target="#AddTarjetaModal" data-bs-cid="${cid}">
			<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-plus-lg" viewBox="0 0 16 16">
				<path fill-rule="evenodd"
						d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2" />
			</svg>
		</div>


        <div class="ms-auto dropdown">
         <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class=" bi bi-three-dots dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false" viewBox="0 0 16 16">
		   <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3"></path>
		 </svg>

		 <ul class="dropdown-menu dropdown-menu-dark">
			<li class="dropdown-item"> Editar</li>
			<li class="dropdown-item "> Mover a la izquierda</li>
			<li>
				<hr class="dropdown-divider">
			</li>
			<li><a class="eliminar-col dropdown-item text-danger" href="#">Eliminar columna</a></li>
		 </ul>
		</div>`

    root.querySelector(".titulo-Board").addEventListener('change', (e) => {
        const titulo = e.target.value
        props.onUpdatetittle({ titulo, cid })

    });

    sortable = new Sortable(Content, {
        group: "kanban",
        dataIdAttr: "data-tid",//establece el id para el toarray
        animation: 150,
        draggable: ".tarjeta-kanban",
        ghostClass: "ghost-tarjeta-kanban",
        onAdd: function (e) {
            console.log("modificar salida")

            let TID = e.item.dataset.tid;
            let CID_anterior = e.from.closest(".columna-kanban").dataset.cid;
            let CID_nuevo = e.to.closest(".columna-kanban").dataset.cid;

            console.log(CID_anterior)
            console.log(CID_nuevo)
            console.log(TID)

            const tarjetas = this.toArray().map((TID, index) => ({
                TID,
                Orden: index
            }));
            //reordenadar toda la lista remota a esto
            props.moverTarjeta({ TID, CID_anterior, CID_nuevo, tarjetas })

        },
        onRemove: function (e) {
            const CID = e.from.closest(".columna-kanban").dataset.cid;
            console.log("modificar origen")
            const tarjetas = this.toArray().map((TID, index) => ({
                TID,
                Orden: index
            }));
            //organizar la salida
            props.reorganizar({ CID, tarjetas })
            //modificar toda la lista remota

        },
        onUpdate: function (e) {
            const CID = e.to.closest(".columna-kanban").dataset.cid;
            const tarjetas = this.toArray().map((TID, index) => ({
                TID,
                Orden: index
            }));
            //actualizar el servidor
            props.reorganizar({ CID, tarjetas })
            console.log("modificacion interna")
        }
    })
    Content.sort = (id) => { sortable.sort(id) }




    const render = (container) => {
        container.appendChild(root)
    }

    root.destroy = () => {
        if (sortable) {
            sortable.destroy()
        }
        root.remove()
    }


    return { root, render }
}