import { Builder } from "./controller/app.js";

//inicializar la aplicacion
function app() {
    const AppRoot = document.getElementById('app');
    const App = Builder()
    App.AppBuildLogin(AppRoot)
}

//let x = document.getElementById("Cards-Grid")

//new Sortable(x, {
//animation: 150,
//ghostClass: 'blue-background-class',
//draggable: ".tarjeta",
//});

app()