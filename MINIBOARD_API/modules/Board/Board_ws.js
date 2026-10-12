
const { cargar_Diagrama ,eliminar_Usuario, lista_usuarios} = require("./ws_components/Board.js");
const { Create_col, Cambiar_col, reorganizar_col, eliminar_columna, actualizarTituloCol, reorganizar } = require("./ws_components/Columna.js");
const Enviar_Invitacion = require("./ws_components/Invitacion.js");
const { crear_tarjeta, eliminar_tar, content_tar, Editar_tar } = require("./ws_components/Tarjeta.js");





/**
 * Registra y gestiona los eventos de Socket.IO para sincronizacion en board
 * @param {*} socket instacia de socket io
 * @param {*} io instancia de conexion
 */
function Socket_Board(socket, io) {


    /**
     * Carga el diagrama, verifica los permisos del usuario en la base de datos=>registra al usuario y sus permisos en la conexion,
     * une al socket a la sala correspondiente y retorna la estructura del tablero ordenada.
     */
    socket.on('cargar_D', (msg, callback) => cargar_Diagrama(msg, callback, socket));

    /* Crea una nueva columna en el diagrama actual y notifica a todos los clientes en la sala.*/
    socket.on("create_C", (msg) => Create_col(msg, socket, io));

    /**
     * Crea una nueva tarjeta vinculada a una columna y difunde el evento a la sala.
     */
    socket.on("create_T", (msg) => crear_tarjeta(msg,socket,io));

    /**
     * Cambia la columna (cid) a la que esta asociada una tarjeta
     */
    socket.on("cambiar_col", (msg) => Cambiar_col(msg, socket));

    /**
     * Actualiza el orden (posiciones) de un grupo de tarjetas dentro de una columna.
     */
    socket.on("reorganizar", async (msg) => reorganizar(msg, socket));

    /**
     *Actualiza el orden (posiciones) de las columnas
     */
    socket.on("reorganizarC", async (msg) => reorganizar_col(msg, socket));

    //elimina una tarjeta 
    socket.on("eliminar_tarjeta", async (msg) => eliminar_tar(msg, socket,io))

    //elimina una columna
    socket.on("eliminar_columna", async (msg) => eliminar_columna(msg,socket,io))

    //obtener el contenido de una tarjeta
    socket.on("content_tar", async (msg, callback) => content_tar(msg,callback,socket));

    //Actualiza el título de una columna existente 
    socket.on("UpdateT", async (msg) => actualizarTituloCol(msg,socket,io))

    //Modifica los atributos de una tarjeta (color, título, contenido)
    socket.on("editar_tar", async (msg, callback) => Editar_tar(msg,callback,socket,io));

    socket.on("lista_usuarios",async(msg,callback)=>lista_usuarios(msg,callback,socket))

    /**
     * Envía una invitación a un usuario validando permisos y existencia previa.
     */
    socket.on("enviar_invitacion", (msg, callback) => Enviar_Invitacion(msg, callback, socket));


    /**
         * Elimina a un participante del diagrama y notifica al usuario afectado y a la sala.
         */
    socket.on("eliminar_usuario", async (msg, callback) => eliminar_Usuario(msg,callback,socket,io));
}






module.exports = Socket_Board;