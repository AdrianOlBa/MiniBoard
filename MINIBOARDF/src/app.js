import { Builder } from "./controller/app.js";
import { Search_Cookie } from "./utilities/Search_Cookies.js";

//inicializar la aplicacion
function app() {
    const AppRoot = document.getElementById('app');
    const App = Builder()
    let token = Search_Cookie("token")
    if (token) {
        App.AppBuildHome(AppRoot)
    } else {
        App.AppBuildLogin(AppRoot)
    }   
}


app()