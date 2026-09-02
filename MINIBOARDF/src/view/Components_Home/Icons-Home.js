/**
 * Iconos de la cabecera de Home
 * Aqui se definira la estructura y
 * @returns 
 */
export function Icons_Home() {

    //datos basicos sobre cada icono
    const iconos = {
        Home: { class: "to_Home icono Home d-none d-lg-flex", id: "Home_Header" },
        Favorito: { class: "to_Favorito icono Favorito d-none d-lg-flex", id: "Favoritos_Header" },
        Logout: { class: "to_Logout icono logout-button mt-auto d-none d-lg-flex", id: "Logout_Header" },
        Menu: { class: "icono icono-menu ms-auto d-flex d-lg-none ", id: "Menu_Header" }
    };


    for (let i in iconos) {
        let datos = iconos[i];

        let elemento = document.createElement("div");
        elemento.className = datos.class;
        elemento.id = datos.id;

        datos.elemento = elemento;
    }


    //contenido de cada icono
    iconos.Home.elemento.innerHTML =
        `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" class="bi bi-house" viewBox="0 0 16 16">
		  <path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L2 8.207V13.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V8.207l.646.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293zM13 7.207V13.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V7.207l5-5z"></path>
		</svg>`;
    iconos.Favorito.elemento.innerHTML =
        `					<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor"
						class="bi bi-star-fill" viewBox="0 0 16 16">
						<path
							d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
					</svg>`;
    iconos.Logout.elemento.innerHTML =
        `							<svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="currentColor"
								class="bi bi-door-closed" viewBox="0 0 16 16">
								<path
									d="M3 2a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v13h1.5a.5.5 0 0 1 0 1h-13a.5.5 0 0 1 0-1H3zm1 13h8V2H4z" />
								<path d="M9 9a1 1 0 1 0 2 0 1 1 0 0 0-2 0" />
							</svg>`;
    let Menu = iconos.Menu.elemento
    Menu.dataset.bsToggle = 'offcanvas';
    Menu.dataset.bsTarget = '#offcanvasResponsive';
    Menu.setAttribute('aria-controls', 'offcanvasResponsive');
    Menu.innerHTML = `					<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor"
						class="bi bi-list" viewBox="0 0 16 16">
						<path fill-rule="evenodd"
							d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5" />
					</svg>`


    const render = (container) => {
        for (let i in iconos) {
            container.appendChild(iconos[i].elemento)
        }
    }



    return {iconos,render};
}