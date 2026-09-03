export function Off_Menu_home() {
    //definicion menu
    let Menu = {
        Home: { nombre: "Home", class: "to_Home list-group-item list-group-item-action active", id: "off-Home" },
        Favoritos: { nombre: "Favorito", class: "to_Favorito list-group-item list-group-item-action", id: "off-Favorito" },
        Ajustes: { nombre: "AJuste", class: "to_Ajustes list-group-item list-group-item-action", id: "off-Ajustes" }
    }

    //Definicion Logout y cuerpo general
    const Logout = document.createElement("div")
    const root = document.createElement("div");
    root.className = 'offcanvas-lg offcanvas-end';
    root.id = 'offcanvasResponsive';
    root.tabIndex = -1;
    root.setAttribute('aria-labelledby', 'offcanvasResponsiveLabel');
    Logout.className = "icono logout-button mt-auto ms-auto to_Logout"
    Logout.innerHTML += `<svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="currentColor" class="bi bi-door-closed" viewBox="0 0 16 16">
							<path d="M3 2a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v13h1.5a.5.5 0 0 1 0 1h-13a.5.5 0 0 1 0-1H3zm1 13h8V2H4z"></path>
							<path d="M9 9a1 1 0 1 0 2 0 1 1 0 0 0-2 0"></path>
						</svg>`


    //HEADER OFF CANVAS
    root.innerHTML += `
    <div class="offcanvas-header">
		<h5 class="offcanvas-title" id="offcanvasResponsiveLabel">MINIBOARD</h5>
		<button type="button" class="btn-close" data-bs-dismiss="offcanvas" data-bs-target="#offcanvasResponsive" aria-label="Close"></button>
	</div>`


    //BODY OFFCANVAS
    let Body = document.createElement("div");
    Body.className = "offcanvas-body d-flex flex-column d-lg-none p-0 mt-3";

    let Lista = document.createElement("div");
    Lista.className = "list-group list-group-flush"

    //agregar elementos del menu a la lista
    for (let titulo in Menu) {

        let datos = Menu[titulo];
        console.log(datos)
        let elemento = document.createElement("div");
        elemento.className = datos.class;
        elemento.id = datos.id;
        elemento.innerHTML = `
        <div class="d-flex w-100 to_${titulo.nombre}">
          <h5 class="mb-1">${Menu[titulo].nombre}</h5>
        </div>`;
        Lista.appendChild(elemento);
        //ariant current true
    }

    //agregar LOgout
    Body.appendChild(Lista)
    Body.appendChild(Logout)
    root.appendChild(Body)

    const render = (container) => {
        container.appendChild(root)
    }


    return { root,render }
}