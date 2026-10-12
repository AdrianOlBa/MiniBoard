import { Usuario } from "../Model/Usuario.js";
import { Home_Page } from "../view/Home_Page.js";
import { Search_Cookie } from "../utilities/Search_Cookies.js";
import { Logout } from "../utilities/Logout.js";
import { Board } from "../Model/Boards.js";
import { Builder } from "./app.js";


/**
 * Controla la vista principal del usuario autenticado.
 * Inicializa la vista, el modelo y los servicios necesarios para manejar boards e invitaciones.
 */
export class BuildHome {

  /**
   * Crea la instancia de la home y prepara los callbacks de la vista.
   * Configura el modelo de usuario.
   */
  constructor() {
    this.boards = []
    this.view = Home_Page({ onBoard: this.onBoard, onBar: this.onBar, onAdd: this.onAdd, listaInvitaciones: this.listaInvitaciones, onAccept: this.onAccept, onReject: this.onReject });
    this.model = new Usuario();
    this.Board = new Board()
    this.Builder = Builder()
  }



  /**
   * Carga home con los diagramas del usuario actual.
   * Lee el token, consulta los boards y renderiza la vista con esa lista.
   * @param {HTMLElement} container Contenedor donde se dibuja la home.
   */
  async render(container) {
    this.model.token = Search_Cookie("token")
    let boards = await this.model.Get_Diagramas()
    this.container = container;
    this.view.render(container);
    this.view.load(boards)
  }


  /**
   * Maneja las acciones sobre cada tarjeta de board.
   * Marca favoritos, elimina o llama al tablero según el elemento clickeado.
   * @param {Event} event 
   */
  onBoard = async (event) => {
    let elemento = event.target
    let tarjeta = event.target.closest(".tarjeta")
    //Buscar si se clickeo sobre algun elemento de interes
    if (elemento.closest(".icono-favorito")) {
      this.Board.Change_Favorite_Diagrama(Search_Cookie("token"), { did: tarjeta.dataset.did })
      this.view.Favorite(tarjeta)

    } else if (elemento.closest(".icono-eliminar")) {
      let respuesta = await this.Board.Delete_Diagrama(Search_Cookie("token"), { did: tarjeta.dataset.did })

      this.view.notificacion.showNotification({ message: respuesta.message, tipo: "success" })
      this.view.Delete(tarjeta)

    } else if (tarjeta) {
      this.Builder.AppBuildBoard(this.view.Body, { did: tarjeta.dataset.did })
    }

  }

  /**
   * Controla la navegación de la barra lateral y la sesión del usuario.
   * Si el token no existe, cierra la sesión y recarga la página; si existe, cambia entre home, favoritos y logout.
   * @param {Event} event click sobre menu
   */
  onBar = async (event) => {
    let elemento = event.target
    console.log(elemento)

    if (Search_Cookie("token") == null) {
      console.log("no hay token")
      Logout()
      window.location.reload()
    }

    if (elemento.closest(".to_Home")) {
      this.Builder.Disconnect()

      console.log(await this.model.Get_Diagramas())
      this.view.load(await this.model.Get_Diagramas())
    } else if (elemento.closest(".to_Favorito")) {
      this.Builder.Disconnect()
      this.view.load(await this.model.Get_Diagramas_Favoritos())
    } else if (elemento.closest(".to_Logout")) {

      Logout()
      window.location.reload()
    }
  }



  /**
   * Crea un nuevo diagrama y lo añade a la vista local.
   * Sube datos del board muestra una notificación y actualiza vista
   * @param {object} datos Datos del diagrama a registrar.
   * @param {Event} event 
   */
  onAdd = async (datos, event) => {

    let respuesta = await this.Board.Add_Diagrama(Search_Cookie("token"), datos)
    console.log(respuesta)
    this.view.notificacion.showNotification({ message: respuesta.message, tipo: "success" })
    this.view.add(respuesta.diagrama)

  }





  /**
   * Obtiene las invitaciones pendientes del usuario.
   * Devuelve la lista de invitaciones para la vista.
   */
  listaInvitaciones = async () => {
    let invitaciones = await this.model.invitaciones()
    console.log(invitaciones)
    return invitaciones
  }

  /**
   * Acepta una invitación del usuario.
   * @param {string} iid Identificador de la invitación.
   * @returns {Promise<object>} Respuesta del backend con el resultado del rechazo. 
   */
  onAccept = async (iid) => {
    let respuesta = await this.model.Aceptar_inv(iid)
    console.log(respuesta)
    return respuesta
  }

  /**
   * Rechaza una invitación del usuario.
   * @param {string} iid Identificador de la invitación.
   * @returns {Promise<object>} Respuesta del backend con el resultado del rechazo.
   */
  onReject = async (iid) => {
    let respuesta = await this.model.Rechazar_inv(iid)
    return respuesta
  }



}