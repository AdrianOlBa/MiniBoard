import { Usuario } from "../Model/Usuario.js";
import { Home_Page } from "../view/Home_Page.js";
import { Search_Cookie } from "../utilities/Search_Cookies.js";
import { Logout } from "../utilities/Logout.js";
import { Board } from "../Model/Boards.js";
/**
 * Controller del modulo de Login 
 */
export class BuildHome {

  constructor() {
    this.estado = "Home"//favoritos... , ajustes
    this.boards = []
    this.view = Home_Page({ onBoard: this.onBoard, onBar: this.onBar, onAdd: this.onAdd });
    this.model = new Usuario(Search_Cookie("token"));
    this.Board = new Board()
  }



  /**
   * Dibuja sobre un contenedor el contenido de la vista
   * @param {HTMLElement} container 
   */
  async render(container) {
    let boards = await this.model.Get_Diagramas()
    console.log(boards)
    this.container = container;
    this.view.render(container);
    this.view.load(boards)
  }



  onBoard = async (event) => {
    let elemento = event.target
    let tarjeta = event.target.closest(".tarjeta")
    console.log(this.view)
    
    if (elemento.closest(".icono-favorito")) {
      this.Board.Change_Favorite_Diagrama(Search_Cookie("token"), { did: tarjeta.dataset.did })
      this.view.Favorite(tarjeta)
    } else if (elemento.closest(".icono-eliminar")) {
      this.Board.Delete_Diagrama(Search_Cookie("token"), { did: tarjeta.dataset.did })
      //arreglar esto convertir a ... y opcion de eliminar o salir del diagrama
      this.view.Delete(tarjeta)
    } else if (tarjeta) {
      console.log("tarjeta")
    }

  }


  onBar = async (event) => {
    let elemento = event.target

    if (elemento.closest(".to_Home")) {
      console.log(await this.model.Get_Diagramas())
      this.view.load(await this.model.Get_Diagramas())
    } else if (elemento.closest(".to_Favorito")) {
      this.view.load(await this.model.Get_Diagramas_Favoritos())
    } else if (elemento.closest(".to_Logout")) {
      Logout()
      window.location.reload()
    }
  }

  onAdd = async (datos, event) => {
    console.log(datos)
    let respuesta = await this.Board.Add_Diagrama(Search_Cookie("token"), datos)
    console.log("dasdasd")
    console.log(respuesta)
    this.view.add(respuesta.diagrama)
    console.log(respuesta)
  }

  destroy() {
    if (this.container) this.container.innerHTML = '';
  }

}