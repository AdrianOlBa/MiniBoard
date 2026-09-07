import { BuildBoard } from "./BuildBoard.js";
import { BuildHome } from "./BuildHome.js";
import { BuildLogin } from "./BuildLogin.js";

const Board = new BuildBoard();
const Home = new BuildHome();
const Login = new BuildLogin();

/**
 * Encargado de manipular el estado global de la aplicacion (pagina) , basicamente que los controladores no se llamen entre ellos sin control
 */
export function Builder() {
    /**
     * Construye e inicializa el Login
     * @param {HTMLElement} container 
     */
    const AppBuildLogin = (container) => {
        Login.render(container)
    }

    const AppBuildHome = (container) => {
        Home.render(container)
    }

    const AppBuildBoard = (Body) => {
        Board.render(Body)
    }

    const Disconnect = () =>{
        Board.onDisconnect()
    }



    return { AppBuildHome, AppBuildLogin, AppBuildBoard,Disconnect }
}