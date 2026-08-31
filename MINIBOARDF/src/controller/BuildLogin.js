import { Login_Page } from '../view/Login_Page.js';
import { Usuario } from "../Model/Usuario.js";

/**
 * Controller del modulo de Login 
 */
export class BuildLogin {

  constructor() {
    this.estado = "Login";
    this.view = Login_Page({ onChangue: this.onChangue, onSubmit: this.onSubmit });
    this.model = new Usuario();
    //detener el login como prop para evento evlauar y enviar    
  }

  /** 
   * Actualizar el Login y
   * cambia el estado logico del Login
  */
  onChangue = () => {
    this.view.update({ estado: this.estado })
    this.estado = (this.estado == "Login") ? "Register" : "Login"
  }


  /**
   * Procesa el envío del formulario según el estado actual del login
   */
  onSubmit = async () => {
    let respuesta
    let datos = (this.view.Form_data());

    switch (this.estado) {
      case "Register":
        respuesta = await this.model.Registrar(datos)
        console.log(resp_serv)
        break
      case "Login":
        respuesta = await this.model.Login(datos)
        console.log(respuesta.error)
        if (respuesta.error) {
          this.view.error(respuesta.error)
        }

        console.log(respuesta)
        break
    }
  }



  /**
   * Dibuja sobre un contenedor el contenido de la vista
   * @param {HTMLElement} container 
   */
  render(container) {
    this.container = container;
    this.view.render(container)
  }



  destroy() {
    if (this.container) this.container.innerHTML = '';
  }

}