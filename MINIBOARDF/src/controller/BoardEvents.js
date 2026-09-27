
import { Board_events } from "../Model/Board.js";
import { Search_Cookie } from "../utilities/Search_Cookies.js";


/**
 * Controlador de eventos del servidor para el tablero.
 * Recibe las notificaciones de Socket.io y las traduce en acciones sobre la interfaz de usuario.
 */
export class BoardEvents {

    constructor({ view }) {
        this.events = Board_events({ onCreateCol: this.onCreateCol, onCreateTar: this.onCreateTar, onDelete: this.onDelete, tituloC: this.tituloC, tituloT: this.tituloT, onUpdate: this.onUpdate, reorganizar: this.reorganizar, cambiar_col: this.cambiar_col })//pasar callbacks de que sucedera
        this.view = view
        this.rol = Search_Cookie("Rol")
    }
    //continuar con error board col no es una fucnion+

    onCreateCol = (data) => {
        console.log(data)
        this.view.addItem(data, "columna", Search_Cookie("rol"))
    }
    onCreateTar = (data) => {
        this.view.addItem(data, "tarjeta", Search_Cookie("rol"))
    }
    onDelete = (type, ID) => {
        this.view.delItem(type, ID)
    }

    tituloC = (cid, titulo) => {
        this.view.tituloC(cid, titulo)
    }
    tituloT = (tid, titulo) => {
        this.view.tituloT(tid, titulo)
    }

    cambiar_col = (id, cid_a, cid_n) => {
        this.view.cambiocol(id,cid_a,cid_n)
    }

    reorganizar = (type, id, cid) => {
        if (type === "col") {
            console.log(id)
            this.view.reorganizarC(id)
        } else if (type === "tar") {
            console.log("tarjetas")
            this.view.reorganizarT(id, cid)
        }
    }


    //onUpdateRol



}