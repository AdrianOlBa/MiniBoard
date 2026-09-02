import { BuildHome } from "./BuildHome.js";
import { BuildLogin } from "./BuildLogin.js";
//el problema era que iba atner que crear un  builder de cambios para cambiar en cada controller , solucion : builder global con parametors que definen los cambios , el controller oslo los llama
export function Builder() {

    const AppBuildLogin = (container) => {
        let page = new BuildLogin({ onLogin: () => { AppBuildHome(container) } })
        page.render(container)
    }

    const AppBuildHome = (container) => {
        let page = new BuildHome({ onBoard: () => { } , onLogout:()=>{}})
        page.render(container)
    }

    return { AppBuildHome, AppBuildLogin }
}