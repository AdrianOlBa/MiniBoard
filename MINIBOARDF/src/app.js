import { Builder } from "./controller/app.js";
import { Search_Cookie } from "./utilities/Search_Cookies.js";


function app() {
    const AppRoot = document.getElementById('app');
    //iniciar navegacion de la app
    const App = Builder()
    let token = Search_Cookie("token")


    if (token) {
        App.AppBuildHome(AppRoot)
    } else {
        App.AppBuildLogin(AppRoot)
    }   
    

    
}
app()

