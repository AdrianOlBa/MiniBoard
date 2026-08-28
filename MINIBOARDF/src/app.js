import { BuildLogin } from "./controller/BuildLogin.js";

//inicializar la aplicacion
function app(){
const AppRoot=document.getElementById('app');
const root=new BuildLogin(AppRoot);
root.render(AppRoot);
}

app()