
import { Board_events } from "../Model/Board.js";
import { Search_Cookie } from "../utilities/Search_Cookies.js";
import { Builder } from "./app.js";


/**
 * Controlador de eventos del servidor para el tablero.
 * Recibe las notificaciones de Socket.io y las traduce en acciones sobre la interfaz de usuario.
 */
export class BoardEvents {
    Builder_paginas = Builder()

    /**
     * Registra los callbacks y guarda la vista y el rol actual
     * @param { object } view comunicacion con la vista del tablero
     */
    constructor({ view }) {
        this.events = Board_events({
            onCreateCol: this.onCreateCol, onCreateTar: this.onCreateTar,
            onDelete: this.onDelete, tituloC: this.tituloC,
            Editar_Tarjeta: this.Editar_Tarjeta, onUpdate: this.onUpdate, reorganizar: this.reorganizar,
            cambiar_col: this.cambiar_col, onError: this.onError, onExpulsed: this.onExpulsed
        })
        this.view = view
        this.rol = Search_Cookie("Rol")
    }

    /**
     * Muestra un error del tablero.
     * muestra el error en la vista.
     * @param {*} error Error recibido.
     */
    onError = (error) => {
        console.log(error)
        this.view.error.showError(error);
    }


    /**
     * Añade una columna a la vista.
     * Envía sus datos y el rol actual a la vista.
     * @param {*} data Datos de la columna.
     */
    onCreateCol = (data) => {
        console.log(data)
        this.view.addItem(data, "columna", Search_Cookie("rol"))
    }

    /**
     * Añade una tarjeta a la vista.
     * @param {*} data Datos de la tarjeta.
     */
    onCreateTar = (data) => {
        console.log(data)
        this.view.addItem(data, "tarjeta", Search_Cookie("rol"))
    }

    /**
     * Elimina un elemento de la vista.tarjeta o columna
     * @param {string} type Tipo de elemento. col o tar
     * @param {*} ID Identificador del elemento.
     */
    onDelete = (type, ID) => {
        this.view.delItem(type, ID)
    }

    /**
     * Cambia el título de una columna.
     * @param {*} cid Id de la columna.
     * @param {string} titulo Nuevo título.
     */
    tituloC = (cid, titulo) => {
        this.view.tituloC(cid, titulo)
    }

    /**
     * Edita una tarjeta.
     * @param {*} tid Id de tarjeta.
     * @param {string} titulo Nuevo título.
     * @param {*} color Nuevo color.
     */
    Editar_Tarjeta = (tid, titulo, color) => {
        this.view.Editar_Tarjeta(tid, titulo, color)
    }

    /**
     * Mueve una tarjeta a otra columna.
     * @param {*} id Id de la tarjeta.
     * @param {*} cid_a Id de la columna de origen.
     * @param {*} cid_n id de la columna de destino.
     */
    cambiar_col = (id, cid_a, cid_n) => {
        this.view.cambiocol(id, cid_a, cid_n)
    }

    /**
     * Reorganiza una columna o una tarjeta.
     * @param {string} type Tipo de elemento col,tar
     * @param {*} id id del elemento.
     * @param {*} cid id de la columna (solo para tarjetas).
     */
    reorganizar = (type, id, cid) => {
        if (type === "col") {
            console.log(id)
            this.view.reorganizarC(id)
        } else if (type === "tar") {
            console.log("tarjetas")
            this.view.reorganizarT(id, cid)
        }
    }


    /**
     * expulsión del usuario del tablero.
     * Desconecta y muestra la página de inicio con un mensaje; 
     */
    onExpulsed = async () => {
        this.Builder_paginas.Disconnect()
        this.Builder_paginas.AppBuildHome({ message: "has sido expulsado por un administrador", tipo: "error" })
    }



}