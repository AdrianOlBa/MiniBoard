import { Add_Button_Home } from "./Components_Home/Add-Button-Home.js";
import { Cards_Home } from "./Components_Home/Cards-Home.js";
import { Icons_Home } from "./Components_Home/Icons-Home.js";
import { Off_Menu_home } from "./Components_Home/Off-Menu-Home.js";

export function Home_Page() {
    const root = document.createElement("div");
    const Header = document.createElement("div")
    const Body = document.createElement("div")
    let OffMenu = Off_Menu_home();
    let iconos = Icons_Home();
    let tarjeta_p = Cards_Home();
    let Add = Add_Button_Home();


    //Contendor
    root.className = 'row flex-column flex-lg-row h-100';
    root.id = "Contenedor-Home";
    //Header
    Header.className = "Header-App d-flex flex-lg-column col-12 col-lg-2 p-0";
    Header.id = "Header-Home";
    //Body
    Body.className = "Content-App col";
    Body.id = "Body-Home";


    iconos.render(Header)

    OffMenu.render(Header)

    tarjeta_p.render(Body)
    Add.render(Body)


    root.appendChild(Header)
    root.appendChild(Body)

    const render = (container) => {
        container.innerHTML = '';
        container.appendChild(root)
    }

    return { root, render }
}