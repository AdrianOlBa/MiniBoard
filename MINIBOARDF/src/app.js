import { BuildHome } from "./controller/BuildHome.js";
import { BuildLogin } from "./controller/BuildLogin.js";

//inicializar la aplicacion
function app(){
const AppRoot=document.getElementById('app');
const root=new BuildLogin(AppRoot);
root.render(AppRoot);
}

//let x = document.getElementById("Cards-Grid")

//new Sortable(x, {
    //animation: 150,
    //ghostClass: 'blue-background-class',
    //draggable: ".tarjeta",
//});

app()