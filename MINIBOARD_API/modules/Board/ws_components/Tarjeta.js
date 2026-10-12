const { sequelize } = require("../../../server/database/conexion.js");
const tarjeta = sequelize.models.tarjeta


/**
 * Crea una tarjeta en el diagrama.
 * Valida permisos, guarda la tarjeta y emite el evento con sus datos.
 * @param {Object} msg Datos de la tarjeta.
 * @param {Object} socket Conexión y datos del usuario.
 * @param {Object} io Servidor de Socket.IO.
 * @returns {Promise<void>} notifica el resultado mediante eventos.
 */
async function crear_tarjeta(msg, socket, io) {
    try {
        if (!socket.datos.permisos.mover) {
            socket.emit("error", "No puedes mover");
            return;
        }
        console.log("asjkndnasjkndjaksd")
        console.log(msg)
        const CID = msg.cid;


        let nuevaTarjeta = await tarjeta.create({
            cid: CID,
            titulo: msg.titulo,
            creador: socket.datos.UID,
            contenido: msg.contenido,
            color: msg.color
        });
        nuevaTarjeta = nuevaTarjeta.toJSON()
        nuevaTarjeta.Creador = { nombre: socket.datos.Nombre, correo: socket.datos.Correo }
        console.log(nuevaTarjeta)
        io.to(`diagrama_${socket.datos.DID}`).emit("tarjeta_creada", nuevaTarjeta);


    } catch (error) {
        console.error(error);
        socket.emit("error", "Error creando tarjeta");


    }
}

/**
 * Elimina una tarjeta del diagrama.
 * Valida permisos, elimina el registro y emite el evento con el identificador de la tarjeta eliminada.
 * @param {Object} msg Datos de la tarjeta que se eliminará.
 * @param {Object} socket Conexión y datos del usuario.
 * @param {Object} io Servidor de Socket.IO.
 * @returns {Promise<void>} notifica el resultado mediante eventos.
 */
async function eliminar_tar(msg, socket, io) {
    try {
        if (!socket.datos.permisos.mover) {
            socket.emit("error", "No tienes permisos para eliminar");
            return;
        }
        console.log("mensaje tarjeta");
        console.log(msg);

        let result = await tarjeta.destroy({
            where: { tid: msg.tid }
        });


        io.to(`diagrama_${socket.datos.DID}`).emit("tarjeta_eliminada", msg.tid);

    } catch (error) {
        console.log(error);

        socket.emit("error", "Error al eliminar la tarjeta");
    }

}

/**
 * Obtiene el contenido de una tarjeta.
 * Valida permisos y existencia; envía el contenido mediante el callback.
 * @param {Object} msg Datos de la tarjeta solicitada.
 * @param {Function} callback 
 * @param {Object} socket Conexión y datos del usuario.
 * @returns {Promise<void>} Callback: contenido o un error.
 */
async function content_tar(msg, callback, socket) {
    try {
        if (!socket.datos.permisos.mover) {
            socket.emit("error", "No tienes permisos para leer datos");

            callback({ error: "No tienes permisos para leer datos" });

            return;
        }

        console.log("Obteniendo contenido de tarjeta:", msg);
        const TID = msg.tid;

        const tarjetaEncontrada = await tarjeta.findOne({
            where: { tid: TID }
        });

        if (!tarjetaEncontrada) {
            socket.emit("error", "Tarjeta no encontrada");

            callback({ error: "Tarjeta no encontrada" });

            return;
        }


        callback({
            ok: true,
            contenido: tarjetaEncontrada.contenido
        });


    } catch (error) {
        console.error(error);

        callback({ error: "Error al obtener el contenido de la tarjeta" });

        socket.emit("error", "Error al obtener el contenido de la tarjeta");

    }

}

/**
 * Actualiza los datos de una tarjeta.
 * Valida permisos, guarda los cambios y emite el evento de edición.
 * @param {Object} msg Datos de la tarjeta y cambios solicitados.
 * @param {Function} callback
 * @param {Object} socket Conexión y datos del usuario.
 * @param {Object} io Servidor de Socket.IO.
 * @returns {Promise<void>} Callback: ok o un error
 */
async function Editar_tar(msg, callback, socket, io) {
    try {
        if (!socket.datos.permisos.mover) {
            socket.emit("error", "No tienes permisos para editar");
            return;
        }
        console.log("mensaje")
        console.log(msg)

        let update = await tarjeta.update(
            { color: msg.color, titulo: msg.titulo, contenido: msg.contenido },
            { where: { tid: msg.tid } }
        );
        console.log(update)

        io.to(`diagrama_${socket.datos.DID}`).emit("tarjeta_editada", { tid: msg.tid, titulo: msg.titulo, color: msg.color });

        callback({ ok: true });


    } catch (error) {
        console.log(error);
        socket.emit("error", "Error al actualizar la tarjeta");
    }
}

module.exports = { crear_tarjeta, eliminar_tar, content_tar, Editar_tar }