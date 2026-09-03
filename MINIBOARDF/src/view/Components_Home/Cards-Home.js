function tarjeta_p(did, titulo, Favorito, Rol, color) {
	let tarjeta = document.createElement("div");
	tarjeta.className = 'tarjeta col-6 col-lg-4';
	tarjeta.id = "Cards-Grid";
	tarjeta.dataset.did = did;
	tarjeta.draggable = false;
	tarjeta.innerHTML += `
    <div class="card-body tarjeta-int d-flex flex-column p-3">
							<div class="d-flex flex-row">
								<div class="titulo-diagrama fs-2 align-content-center">
									${titulo}
								</div>

								<div class="material-symbols-outlined  ms-auto icono-favorito" >
									<svg class="favorite_star" xmlns="http://www.w3.org/2000/svg" width="36" height="36"  fill=${Favorito ? "yellow" : "currentColor"} class="bi bi-star-fill" viewBox="0 0 16 16">
										<path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"></path>
									</svg>
								</div>

								<div class="material-symbols-outlined ms-3 icono-eliminar">
									<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="currentColor" class="bi bi-trash2-fill" viewBox="0 0 16 16">
										<path d="M2.037 3.225A.7.7 0 0 1 2 3c0-1.105 2.686-2 6-2s6 .895 6 2a.7.7 0 0 1-.037.225l-1.684 10.104A2 2 0 0 1 10.305 15H5.694a2 2 0 0 1-1.973-1.671zm9.89-.69C10.966 2.214 9.578 2 8 2c-1.58 0-2.968.215-3.926.534-.477.16-.795.327-.975.466.18.14.498.307.975.466C5.032 3.786 6.42 4 8 4s2.967-.215 3.926-.534c.477-.16.795-.327.975-.466-.18-.14-.498-.307-.975-.466z"></path>
									</svg>
								</div>
							</div>


							<div class="d-flex justify-content-end mt-4">
								<div class="etiqueta-rol fs-6">
									${Rol}
								</div>
							</div>

						</div>`

	return tarjeta
}

export function Cards_Home() {
	const root = document.createElement("div");
	//Contendor
	root.className = 'row flex-row';
	root.id = "Cards-Grid";
	new Sortable(root, {
		animation: 150,
		ghostClass: 'blue-background-class',
		draggable: ".tarjeta",
	});


	const load = (boards) => {
		root.innerHTML = '';
		boards.forEach(board => {
			add(board)
		});
	}


	const render = (container) => {
		container.appendChild(root)
	}

	const add = (board) => {

		root.appendChild(tarjeta_p(board.did, board.diagrama?.dnombre || board.dnombre, board.es_favorito, board.rnombre, board.diagrama?.color || board.color))
	}

	const Delete = (tarjeta) => {
		root.removeChild(tarjeta)
	}

    const Favorite = (tarjeta) => {
		let icono_fav= tarjeta.querySelector(".favorite_star")
		let color = icono_fav.getAttribute("fill")
		icono_fav.setAttribute("fill",color==="yellow"?"currentcolor":"yellow")
	}

	return { root, render, add, load , Delete ,Favorite}

}