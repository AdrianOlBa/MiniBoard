import { Search_Cookie } from "../utilities/Search_Cookies.js";
import { BuildBoard } from "./BuildBoard.js";
import { BuildHome } from "./BuildHome.js";
import { BuildLogin } from "./BuildLogin.js";

const Home = new BuildHome();
const Board = new BuildBoard();
const Login = new BuildLogin();
const AppRoot = document.getElementById('app');

/**
 * Crea el conjunto de controladores de la aplicacion.
 *
 * Gestiona la navegacion entre vistas 
 * conecta la inicializacion de la home, el login y el tablero.
 * @returns {{ AppBuildHome: Function, AppBuildLogin: Function, AppBuildBoard: Function, Disconnect: Function }} Objeto con los controladores principales de la aplicacion.
 */
export function Builder() {
    /**
     * Construye e inicializa el Login
     * @param {HTMLElement} container 
     */
    const AppBuildLogin = () => {
        Login.render(AppRoot)
    }

    /**
     * Renderiza la vista principal con el token activo.
     * @param {string} message notificacion al cargar la home.
     * @returns {BuildHome} Instancia de la vista principal.
     */
    const AppBuildHome = (message) => {
        
        Home.render(AppRoot,Search_Cookie("token"))
        if(message){
            Home.view.notificacion.showNotification(message)
        }
        return Home
    }

    /**
     * renderiza la vista del tablero solicitado(did)
     * @param {HTMLElement} Body Contenido o nodo del tablero a renderizar.
     * @param {string} did Identificador del tablero o del usuario asociado.
     * @returns {void}
     */
    const AppBuildBoard = (Body,did) => {
        console.log(did)
        Board.render(Body,did)
    }

    /**
     * Finaliza la sesion del tablero activo.
     * @returns {*} Resultado de la desconexion del tablero.
     */
    const Disconnect = () =>{
        Board.onDisconnect()
    }



    return { AppBuildHome, AppBuildLogin, AppBuildBoard,Disconnect }
}