const  {sequelize}  = require("../../../server/database/conexion.js");
const invitacion = sequelize.models.invitacion
const registro_invitaciones=sequelize.models.registro_invitaciones
const usuarios = sequelize.models.usuarios
const participacion = sequelize.models.participacion


/**
 * Agrega un usuario a las invitaciones de un diagrama.
 * Valida permisos y participación, transaccion : invitacion y registro de la invitacion , resultado por callback, no emite eventos.
 * @param {object} msg Datos de la invitación.
 * @param {Function} callback 
 * @param {object} socket Conexión y datos del usuario.
 * @returns {Promise<void>} Callback: ok o un error.
 */
async function Enviar_Invitacion(msg,callback,socket) {
    console.log(msg)
    
    const t = await sequelize.transaction();

    try {
        
        
        if (!socket.datos.permisos.permisos_ad) {
            return callback({ error: "No tienes permisos de administrador para enviar invitaciones." });
        }

        const { correo, rol } = msg;

        // Validar la existencia del usuario
        const usuarioTarget = await usuarios.findOne({
            where: { correo: correo }
        });

        if (!usuarioTarget) {
            return callback({ error: "El usuario con ese correo no existe en el sistema." });
        }


        const yaParticipa = await participacion.findOne({
            where: { uid: usuarioTarget.uid, did: socket.datos.DID }
        });

        if (yaParticipa) {
            return callback({ error: "El usuario especificado ya es participante de este diagrama." });
        }


        const yaInvitado = await registro_invitaciones.findOne({
            where: { uid: usuarioTarget.uid, did: socket.datos.DID }
        });

        if (yaInvitado) {
            return callback({ error: "El usuario ya cuenta con una invitación pendiente" });
        }

       
        const nuevaInvitacion = await invitacion.create(
            {
                mensaje: '',
                rol: rol || 'Espectador'
            },
            { transaction: t }
        );

      
        await registro_invitaciones.create(
            {
                iid: nuevaInvitacion.iid,
                did: socket.datos.DID,
                uid: usuarioTarget.uid
            },
            { transaction: t }
        );

        await t.commit();

       
        callback({ ok: true });

    } catch (error) {
        await t.rollback();
        console.log("Error al procesar el envío de invitación:", error);

      
        callback({ error: "Ocurrió un error en el servidor al enviar la invitación." });
    }
}




module.exports = Enviar_Invitacion;