import { Board_Page } from "../view/Board_Page.js";
import { Socket_Board } from "../Model/Board.js";
import { Search_Cookie } from "../utilities/Search_Cookies.js";
import { BoardEvents } from "./BoardEvents.js";
import { save_cookie } from "../utilities/Save_Cookie.js";

/**
 * vista, el modelo de sockets y los eventos websockets del tablero
 */
export class BuildBoard {


    constructor() {
        this.view = Board_Page({ onCreateCol: this.onCreateCol, onCreateTar: this.onCreateTar, moverTarjeta: this.moverTarjeta, reorganizar: this.reorganizar, reorganizarC: this.reorganizarC, Contenido_tar: this.Contenido_tar, onEditT: this.onEditT, onUpdatetittle: this.onUpdatetittle, onDelete: this.onDelete });
        this.events = new BoardEvents({ view: this.view })

        this.model = new Socket_Board()//funcion modelo enviar solicitudes
        //pasar callbacks de que sucedera
    }

    /**
    * Envía los datos al servidor mediante el socket.
    * @param {Event} event - Evento 
    * @param {Object} data - informacion nuevaa tarjeta (título, columna destino, etc.).
    */
    onCreateTar = (event, data) => {
        this.model.crearTarjeta(data)
    }

    /**
     * Envía la solicitud para crear una nueva columna en el servidor.
     * @param {Event} event - Evento.
     * @param {Object} data - Información de la nueva columna.
     */
    onCreateCol = (event, data) => {
        console.log(data)
        this.model.crearColumna(data)
    }

    /**
     * Desconecta el socket del servidor y destruye los elementos de la vista.
     */
    onDisconnect = () => {
        //mostrar un seguro que quieres desconectar... con this.view
        this.model.desconectar()
        this.view.destroy()
    }

    /**
     * actualización del orden global del tarjetas al servidor.
     * @param {Object} msg nuevo ordenamiento.
     */
    reorganizar = (msg) => {
        //columna,datos
        console.log("reorganizar")
        console.log(msg)
        this.model.reorganizar(msg)
    }
    /**
 * actualización del orden del tablero al servidor.
 * @param {Object} msg nuevo ordenamiento.
 */
    reorganizarC = (msg) => {
        console.log(msg)
        this.model.reorganizarC(msg)
    }

    /**
     * cambio de columna de una tarjeta.
     * @param {Object} msg -  {tid,nuevacol,antiguacol}
     */
    moverTarjeta = (msg) => {
        console.log("columna cambaida")
        console.log(msg)
        this.model.cambiar_col(msg)
    }

    /**
     * Solicita contenido detallado de una tarjeta.
     * @param {string} tid - ID de la tarjeta.
     * @returns {Promise<Object>} Promesa con los datos de la tarjeta.
     */
    Contenido_tar = async (tid) => {
        let contenido = await this.model.ContenidoTar(tid)
        return contenido
    }


    /**
     * Envía cambios realizados en una tarjeta al servidor.
     * @param {Event} e - Evento 
     * @param {Object} data - Datos de la tarjeta.
     * @returns {Promise<Object>} espuesta de la edición.
     */
    onEditT = async (e, data) => {
        console.log(data)
        let edicion = await this.model.Editartar(data)
        return edicion
    }

    /**
     * Envía  actualización del título al servidor.
     * @param {Object} data ID y el nuevo título.
     */
    onUpdatetittle = async (data) => {
        this.model.Updatetittle(data)
    }

    /**
     * Elimina columna o tarjeta según el tipo 
     * @param {Object} msg Informacion para borrar
     * @param {"Col"|"Tar"} msg.type  Tipo de elemento 
     */
    onDelete = async (msg) => {
        if (msg.type === "Col") {
            console.log(msg)
            this.model.EliminarCol(msg)
        } else if (msg.type === "Tar") {
            console.log(msg)
            this.model.EliminarTar(msg)
        }
    }

    /**
     * Conecta el socket, renderiza la interfaz y carga el tablero.
     * @param {HTMLElement} container - Elemento del DOM donde se insertará la vista.
     * @param {string|number} did - ID del diagrama/tablero a cargar.
     */
    render = async (container, did) => {
        console.log(did)
        this.did = did
        this.model.conectar(Search_Cookie("token"))
        this.view.render(container, did)
        let board = await this.model.cargarDiagrama(did)
        this.view.build(board)
    }

    /**
     * Desconectar y destruir vista
     */
    destroy = () => {
        this.model.desconectar()
        this.view.destroy()
    }

}