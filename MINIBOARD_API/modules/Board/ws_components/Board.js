const { sequelize } = require("../../../server/database/conexion.js");
const columna = sequelize.models.columna
const tarjeta = sequelize.models.tarjeta
const usuarios = sequelize.models.usuarios
const participacion = sequelize.models.participacion


/**
 * Carga un diagrama específico para el usuario conectado, 
 * valida participación y permisos, y entrega la información del diagrama y sus columnas mediante el callback.
 * 
 * @param {Object} msg Datos de la solicitud.
 * @param {Function} callback 
 * @param {Object} socket Conexión del usuario
 */
async function cargar_Diagrama(msg, callback, socket) {
    console.log("cargarsadasd")
    console.log(msg)
    console.log(socket.datos)

    try {

        const DID = msg.did


        let Participacion = await participacion.findOne({ where: { uid: socket.datos.UID, did: msg.did } });

        if (!Participacion) {
            socket.emit("error", "No puedes mover");
            return
        }

        let Permisos = await Participacion.getRol({ raw: true })

        //si hay una conexion anterior...
        const DID_anterior = socket.datos.DID;

        if (DID_anterior) {
            socket.leave(`diagrama_${DID_anterior}`);
        }
        console.log("datos")
        socket.datos.DID = DID;
        socket.datos.Rol = Permisos.rnombre
        socket.datos.permisos = Permisos
        console.log(socket.datos.permisos)


        console.log(socket.datos.Rol)

        const Columnas = await columna.findAll({
            where: {
                did: socket.datos.DID
            },
            include: [{
                model: tarjeta, include: [{
                    model: usuarios, as: "Creador", attributes: ["nombre", "correo"]
                }]
            }],
            order: [
                ['orden', 'ASC'],
                [tarjeta, 'orden', 'ASC']
            ]
        });
        socket.join(`diagrama_${DID}`);
        console.log(socket.datos)
        console.log()
        callback({
            ok: true,
            DID,
            Columnas,
            Rol: socket.datos.Rol
        });

    } catch (err) {

        console.log(err);
        callback({ error: "Error al cargar el diagrama" });
    }
}

/**
 * Elimina un usuario del diagrama actual.
 * Valida permisos de administrador, elimina su participación, notifica y corta su conexion.
 * @param {Object} msg Datos de la solicitud.
 * @param {Function} callback 
 * @param {Object} socket Conexión del usuario.
 * @param {Object} io Servidor de Socket.IO.
 */
async function eliminar_Usuario(msg, callback, socket, io) {
    try {

        if (!socket.datos.permisos.permisos_ad) {
            return callback({ error: "No tienes permisos de administrador para eliminar usuarios." });
        }

        const { uid } = msg;
        const DID = socket.datos.DID;

        if (!uid) {
            return callback({ error: "No se proporcionó el UID del usuario." });
        }
        console.log(uid)
        console.log(socket.datos.UID)
        // Evitar que un admin se elimine a sí mismo mediante este evento
        if (uid == socket.datos.UID) {

            return callback({ error: "No puedes eliminarte a ti mismo." });

        }


        const result = await participacion.destroy({
            where: {
                did: DID,
                uid: uid
            }
        });

        if (result === 0) {
            return callback({ error: "El usuario no participa en este diagrama." });

        }


        const socketsBoard = await io.in(`diagrama_${DID}`).fetchSockets();


        console.log("Sockets en la sala:", socketsBoard);
        for (const targetSocket of socketsBoard) {
            console.log("Socket ID:", targetSocket.id, "UID:", targetSocket.datos.UID);
            if (targetSocket.datos && targetSocket.datos.UID == uid) {
                // avisar al usuario
                targetSocket.emit("usuario_eliminado", {});
                targetSocket.datos = null
                // Sacar  socket de la sala
                targetSocket.leave(`diagrama_${DID}`);

            }
        }
        callback({ ok: true });


    } catch (error) {
        console.error("Error al eliminar usuario:", error);
        if (typeof callback === "function") {
            callback({ error: "Error al intentar eliminar el usuario." });
        }
    }

}


/**
 * Obtiene la lista de usuarios participantes en el diagrama actual.
 * Consulta sus datos y roles, y entrega la lista mediante el callback ok u error;
 * @param {Object} msg Datos de la solicitud.
 * @param {Function} callback 
 * @param {Object} socket Conexión del usuario.
 */
async function lista_usuarios(msg, callback, socket) {
    try {
        const DID = socket.datos.DID;

        if (!DID) {

            return callback({ error: "No estás dentro de ningún diagrama." });

        }

        // Buscar las participaciones vinculadas al diagrama e incluir la información del usuario
        const listaParticipantes = await participacion.findAll({
            where: { did: DID },
            include: [
                {
                    model: usuarios,
                    as: "uid_usuario",
                    attributes: ["uid", "nombre", "correo"]
                }
            ]
        });


        const listaUsuarios = listaParticipantes.map(p => ({
            uid: p.uid_usuario.uid,
            nombre: p.uid_usuario.nombre,
            correo: p.uid_usuario.correo,
            rol: p.rnombre
        }));

        console.log(listaUsuarios)
        if (typeof callback === "function") {
            callback({
                ok: true,
                usuarios: listaUsuarios
            });
        }

    } catch (error) {
        console.log("Error al obtener la lista de usuarios:", error);
        if (typeof callback === "function") {
            callback({ error: "Error al obtener la lista de usuarios." });
        }
    }
}

module.exports = { cargar_Diagrama, eliminar_Usuario, lista_usuarios }