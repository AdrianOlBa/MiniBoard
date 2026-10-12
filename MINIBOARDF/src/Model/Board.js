import { io } from "https://cdn.socket.io/4.7.4/socket.io.esm.min.js";
import { save_cookie } from "../utilities/Save_Cookie.js";
import { Search_Cookie } from "../utilities/Search_Cookies.js";
const socket = io("http://127.0.0.1:3000", {
    autoConnect: false,
});

/**
 * Escucha eventos de Socket.io y ejecuta callbacks para actualizar la interfaz
 * 
 * @param {Object} props - Callbacks para reaccionar a cambios en tiempo real
 */
export function Board_events(props) {
    socket.on("connect", () => {
        console.log("conectado");

    });

    socket.on("usuario_eliminado", () => {
        props.onExpulsed()
    });

    socket.on("error", (msg) => {
        console.log(msg);
        props.onError(msg)
    });
    //creacion
    socket.on("columna_creada", (msg) => { console.log(msg); props.onCreateCol(msg) });



    socket.on("tarjeta_creada", (msg) => { console.log(msg); props.onCreateTar(msg) })

    //{cid}
    socket.on("columna_eliminada", (cid) => { console.log(cid); props.onDelete("col", cid) })
    //{tid}
    socket.on("tarjeta_eliminada", (tid) => { console.log(tid); props.onDelete("tar", tid) })

    socket.on("titulo_col", (msg) => { console.log("titulo_col"); console.log(msg); props.tituloC(msg.cid, msg.titulo) })
    socket.on("tarjeta_editada", (msg) => { console.log("titulo_tar"); console.log(msg); props.Editar_Tarjeta(msg.tid, msg.titulo, msg.color) })


    socket.on("columnas_reorganizadas", (msg) => { console.log("colr"); props.reorganizar("col", msg.id) })
    socket.on("tarjetas_reorganizadas", (msg) => { console.log("tarr"); console.log(msg); props.reorganizar("tar", msg.id, msg.CID) })
    socket.on("cambiar_col", (msg) => { console.log(msg); props.cambiar_col(msg.TID, msg.CID_anterior, msg.CID_nuevo) })
}


/**
 * Gestiona comunicación en tiempo real via WebSockets para el tablero.
 */
export class Socket_Board {

    /**
     * 
     * @param {Object} props callbacks del tablero.
     * @returns {void}
     */
    constructor(props) {
        this.props = props
    }

    /**
     * Conecta al usuario al servidor de WebSockets con un token 
     * @param {string} token Token de autenticación del usuario.
     * @returns {void}
     */
    conectar(token) {

        socket.auth = { token };
        socket.connect();
    }

    /**
     * Carga el diagrama del tablero y guarda el rol del usuario.
     *
     * Solicita la estructura del tablero al servidor y almacena el rol del usuario en cookies .
     *
     * @param {string} DID Identificador del diagrama o tablero.
     * @returns {Promise<Object>} Datos del diagrama con su estado y rol.
     */
    async cargarDiagrama(DID) {
        console.log(DID)
        let diagrama = await socket.emitWithAck('cargar_D', DID);
        console.log(diagrama)
        save_cookie("rol", diagrama.Rol)
        return diagrama
    }

    /**
     * Obtiene el contenido de una tarjeta.
     *
     * @param {string} tid Identificador de la tarjeta.
     * @returns {Promise<Object>} Contenido de la tarjeta solicitado.
     */
    async ContenidoTar(tid) {
        let contenido = await socket.emitWithAck('content_tar', { tid });
        return contenido
    }

    /**
     * Edita los datos de una tarjeta.
     * Envía la nueva información de la tarjeta al servidor y devuelve la respuesta de confirmación.
     *
     * @param {Object} data Nuevos datos de la tarjeta a actualizar.
     * @returns {Promise<Object>} Respuesta del servidor con la confirmación de la edición.
     */
    async Editartar(data) {
        console.log(data)
        let editar = await socket.emitWithAck('editar_tar', data);
        console.log(editar)
        return editar
    }

    /**
     * Emite borrar una columna.
     * @param {Object} msg identificación de la columna.
     */
    async EliminarCol(msg) {
        socket.emit("eliminar_columna", msg)
    }

    /**
     * Emite eliminar una tarjeta.
     * @param {Object} msg identificación de la tarjeta.
     */
    async EliminarTar(msg) {
        console.log(msg)
        socket.emit("eliminar_tarjeta", msg)
    }



    /**
    * Cierra la conexión del socket 
    */
    desconectar() {
        if (socket && socket.connected) {
            socket.disconnect();
            console.log("desconectado")
        }

    }


    /**
    * Crea una nueva col..
    * @param {Object} msg  Datos de la nueva columna.
    */
    crearColumna(msg) {
        console.log(msg)
        socket.emit("create_C", msg)
    }

    /**
    *  creación de una tarjeta.
    * @param {Object} msg - Datos de la nueva tarjeta.
    */
    crearTarjeta(msg) {
        console.log(msg)
        socket.emit("create_T", msg)
    }

    /**
     * Envía el nuevo orden de las tarjetas al servidor.
     * @param {Object} msg IDs y orden de las tarjetas reorganizadas.
     */
    reorganizar(msg) {
        console.log(msg)
        socket.emit("reorganizar", msg)
    }

    /**
     * Envía el nuevo orden específico de columnas.
     * @param {Object} msg - Posiciones actualizadas de las columnas.
     */
    reorganizarC(msg) {
        console.log(msg)
        socket.emit("reorganizarC", msg)
    }

    /**
     * cambio de título de un columna
     * @param {Object} msg - ID col,titulo
     */
    Updatetittle(msg) {
        socket.emit("UpdateT", msg)
    }
    /**
     * Mueve una tarjeta de una columna a otra.
     * @param {Object} msg - TID, CID anterior y nuevo CID.
     */
    cambiar_col(msg) {
        socket.emit("cambiar_col", msg)
    }

    /**
     * Obtiene la lista de usuarios del tablero.
     * @param {Object} msg 
     * @returns {Promise<Object>} Resultado con la lista de usuarios.
     */
    async lista_usuarios(msg) {
        let lista = socket.emitWithAck("lista_usuarios", msg)
        return lista;
    }

    /**
     * Elimina a un usuario del tablero.
     * @param {Object} msg ID del usuario
     * @returns {Promise<Object>} respuesta
     */
    async eliminar_usuario(msg) {
        let resultado = await socket.emitWithAck("eliminar_usuario", msg)
        return resultado
    }

    /**
     * Envía una invitación a un usuario.
     * @param {Object} msg Datos de la invitación
     * @returns {Promise<Object>} Respuesta invitación.
     */
    async Invitar(msg) {
        let resultado = await socket.emitWithAck("enviar_invitacion", msg)
        return resultado
    }

}



