import { Add_Button_Home } from "./Components_Home/Add-Button-Home.js";
import { Cards_Home } from "./Components_Home/Cards-Home.js";
import { Icons_Home } from "./Components_Home/Icons-Home.js";
import { Invitaciones_Button_Home } from "./Components_Home/Invitaciones.js";
import { Off_Menu_home } from "./Components_Home/Off-Menu-Home.js";
import { Notification } from "./Components_Home/Notifications.js";

/**
 * Construye la vista principal de la aplicación.
 * 
 * Cabecera/Barra lateral - Cuerpo
 * con las tarjetas de cada Board y el botón para añadir nuevos elementos.
 * 
 * Conexion de props a eventos registrados en la cabecera o cuerpo
 *
 * @param {Object} props Funciones controlador para manejar eventos.
 * @returns {{root: HTMLElement, render: Function, load: Function, add: Function, Delete: Function, Favorite: Function}}
 * Objeto con acceso a la vista y a funciones de la vista
 */
export function Home_Page(props) {
    const root = document.createElement("div");
    const Header = document.createElement("div")
    const Body = document.createElement("div")
    const Content = document.createElement("div")
    const notificacion = Notification()


    let OffMenu = Off_Menu_home();
    let iconos = Icons_Home();
    let Boards = Cards_Home();
    let Add = Add_Button_Home({ onAdd: props.onAdd });
    let invitaciones = Invitaciones_Button_Home({ ...props, Badd: Boards.add })


    //Contendor
    root.className = 'row flex-column flex-lg-row h-100';
    root.id = "Contenedor-Home";
    //Header
    Header.className = "Header-App d-flex flex-lg-column col-12 col-lg-2 p-0";
    Header.id = "Header-Home";
    //Body
    Body.className = "Body-App col";
    Body.id = "Body_Home";
    //Contenido
    Content.className = "Content-App"
    Content.id = "Content-Home"

    //Inicializar los componentes de Home
    iconos.render(Header)

    OffMenu.render(Header)
    notificacion.render(root)


    root.appendChild(Header)
    root.appendChild(Body)



    Header.addEventListener("click", props.onBar)

    Content.addEventListener("click", props.onBoard)




    /**
     * Carga la vista de home (body y root) dentro del contenedor indicado.
     * @param {HTMLElement} container Elemento raíz donde se montará la vista.
     */
    const render = (container) => {
        container.innerHTML = '';
        container.appendChild(root)
        Body.appendChild(Content)
        Boards.render(Content)
        Add.render(Content)
        invitaciones.render(Content)
    }

    /**
     * Carga el contenido si es que no esta el contendor del contenido lo agrega y carga
     * @param {*} boards 
     */
    const load_content = (boards) => {


        if (!Body.contains(Content)) {
            Body.innerHTML = ""
            Body.appendChild(Content)
            Boards.load(boards)
        } else {
            Boards.load(boards)
        }

    }

    return { root, Header, Body, render, load: load_content, add: Boards.add, Delete: Boards.Delete, Favorite: Boards.Favorite, notificacion }
}