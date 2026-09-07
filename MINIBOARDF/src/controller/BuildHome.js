import { Usuario } from "../Model/Usuario.js";
import { Home_Page } from "../view/Home_Page.js";
import { Search_Cookie } from "../utilities/Search_Cookies.js";
import { Logout } from "../utilities/Logout.js";
import { Board } from "../Model/Boards.js";
import { Builder } from "./app.js";


/**
 * Controller del modulo de Login 
 */
export class BuildHome {

  constructor() {
    this.boards = []
    this.view = Home_Page({ onBoard: this.onBoard, onBar: this.onBar, onAdd: this.onAdd });
    this.model = new Usuario(Search_Cookie("token"));
    this.Board = new Board()
    this.Builder = Builder()
  }



  /**
   * Dibuja sobre un contenedor la estructura de Home y sus elementos dinamicos (lista de boards)
   * @param {HTMLElement} container 
   */
  async render(container) {
    let boards = await this.model.Get_Diagramas()
    this.container = container;
    this.view.render(container);
    this.view.load(boards)
  }



  //busca el grid y lo cambia
  //que si esta el grid o no , cambie y que pueda navegar entre board a home (bar)

  /**
   * Control de eventos sobre el tablero de tarjetas:
   * Tarjeta,Favoritos,Eliminar
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
      this.Board.Delete_Diagrama(Search_Cookie("token"), { did: tarjeta.dataset.did })
      //arreglar esto convertir a ... y opcion de eliminar o salir del diagrama
      this.view.Delete(tarjeta)

    } else if (tarjeta) {
      this.Builder.AppBuildBoard(this.view.Body)
    }

  }

  /**
   * Control de eventos sobre la barra lateral o top,off-canvas (moviles)
   * Navegacion de la HOme - Home,Favoritos,Perfil,AJustes 
   * Cambio de paginas
   * @param {*} event 
   */
  onBar = async (event) => {
    let elemento = event.target


    if (elemento.closest(".to_Home")) {
      this.Builder.Disconnect()
      console.log(await this.model.Get_Diagramas())
      this.view.load(await this.model.Get_Diagramas())
    } else if (elemento.closest(".to_Favorito")) {
      this.Builder.Disconnect()
      this.view.load(await this.model.Get_Diagramas_Favoritos())
    } else if (elemento.closest(".to_Logout")) {
      this.Builder.Disconnect()
      Logout()
      window.location.reload()
    }
  }



  /**
   * Sube un nuevo diagrama al servidor y lo añade a la vista local
   * @param {object} datos 
   * @param {Event} event 
   */
  onAdd = async (datos, event) => {

    let respuesta = await this.Board.Add_Diagrama(Search_Cookie("token"), datos)

    this.view.add(respuesta.diagrama)

  }


}