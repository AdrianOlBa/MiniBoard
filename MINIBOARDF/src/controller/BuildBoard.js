import { Board_Page } from "../view/Board_Page.js";
import { Socket_Board } from "../Model/Board.js";
import { Search_Cookie } from "../utilities/Search_Cookies.js";
import { BoardEvents } from "./BoardEvents.js";

/**
 * vista, el modelo de sockets y los eventos websockets del tablero
 */
export class BuildBoard {


    constructor(home) {
        this.view = Board_Page({
            onCreateCol: this.onCreateCol, onCreateTar: this.onCreateTar,
            moverTarjeta: this.moverTarjeta, reorganizar: this.reorganizar,
            reorganizarC: this.reorganizarC, Contenido_tar: this.Contenido_tar,
            onEditT: this.onEditT, onUpdatetittle: this.onUpdatetittle,
            onDelete: this.onDelete, lista_usuarios: this.lista_usuarios,
            onInvitacion:this.onInvitacion,eliminar_usuario:this.eliminar_usuario
        });
        this.events = new BoardEvents({ view: this.view,home})

        this.model = new Socket_Board()
    
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
        //recordar:mostrar un seguro que quieres desconectar... con this.view
        this.model.desconectar()
        this.view.destroy()
    }

    /**
     * actualización del orden global del tarjetas al servidor.
     * @param {Object} msg nuevo ordenamiento.
     */
    reorganizar = (msg) => {
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
     * Obtiene la lista de usuarios del tablero.
     * @param {Object} msg 
     * @returns {Promise<Object>} Lista de usuarios.
     */
    lista_usuarios = async (msg) => {
        let lista = await this.model.lista_usuarios(msg)
        console.log(lista)
        return lista
    }

    /**
     * Invita a un usuario al tablero.
     * muestra cualquier error recibido 
     * @param {Object} msg Datos de la invitación.
     * @returns {Promise<Object>} Resultado de la invitación.
     */
    onInvitacion = async (msg)=>{
        let invitacion = await this.model.Invitar(msg)
        if (invitacion.error){
            this.view.error.showError(invitacion.error)
        }
        return invitacion
    }

    /**
     * Elimina a un usuario del tablero.
     * muestra cualquier error recibido
     * @param {Object} msg Datos del usuario que se eliminará.
     * @returns {Promise<Object>} Resultado de la eliminación.
     */
    eliminar_usuario = async (msg)=>{
        let resultado = await this.model.eliminar_usuario(msg)
        if (resultado.error){
            this.view.error.showError(resultado.error)
        }
        return resultado
    }
    /**
     * Conecta el socket, renderiza la interfaz y carga el tablero.
     * @param {HTMLElement} container - Elemento del DOM donde se insertará la vista.
     * @param {string} did - ID del diagrama/tablero a cargar.
     */
    render = async (container, did) => {
        console.log(did)
        this.did = did
        this.model.conectar(Search_Cookie("token"))
        let board = await this.model.cargarDiagrama(did)
        console.log(board)
        this.view.render(container, did,board.Rol)
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