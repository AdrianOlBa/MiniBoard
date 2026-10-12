const { sequelize } = require('../../server/database/conexion.js');
const diagrama = sequelize.models.diagrama;
const participacion = sequelize.models.participacion;
const registro_invitaciones = sequelize.models.registro_invitaciones;
const invitacion = sequelize.models.invitacion;
const rol = sequelize.models.rol;


/**
 * Crea un nuevo diagrama , el usuario creador tendra el rol de "Administrador".
 * @param {string} dnombre - Nombre del tablero
 * @param {string} color - Color asociado al tablero 
 * @param {string} uid - Identificador único del creador
 * 
 * @returns {Object} Objeto que contiene el modelo del diagrama creado y el rol
 */
async function User_Service_Create_Board(dnombre, color, uid) {
    let nuevoDiagrama;
    nuevoDiagrama = await diagrama.create({ dnombre, color });
    let nuevo_registro = await participacion.create({ did: nuevoDiagrama.did, uid: uid, rnombre: "Administrador" });
    nuevoDiagrama.setDataValue("rnombre", nuevo_registro.rnombre);

    return { diagrama: nuevoDiagrama };
}

/**
 * Elimina un tablero/diagrama de la base de datos validando previamente si el usuario tiene rol de "Administrador".
 *
 * @param {string|number} did - Identificador único del diagrama
 * @param {string|number} uid - Identificador único del usuario 
 * 
 * @returns {String} Mensaje de confirmación
 */
async function User_Service_Delete_Board(did, uid) {

    let usuario = await participacion.findOne({ where: { did: did, uid: uid } });


    if (!usuario) {
        throw new Error("Usuario no encontrado");
    }

    if (usuario.rnombre === "Administrador") {

        await diagrama.destroy({
            where: {
                did: did,
            },
        });

    } else {

        await participacion.destroy({
            where: {
                did: did,
                uid: uid
            }
        });
        return { message: "Has abandonado el tablero correctamente" };
    }

    return { message: "Diagrama eliminado correctamente" };
}


/**
 * Obtiene la lista completa de diagramas relacionados a un usuario
 *
 * @param {string|number} uid - Identificador único del usuario
 * 
 * @returns {Object} Lista de diagramas y relaciones
 */
async function User_Service_Get_Boards(uid) {
    let Boards = await participacion.findAll({ where: { uid: uid }, include: diagrama })

    console.log(Boards)

    return Boards;
}

async function User_Service_Invitations(uid) {
    console.log("getinv")
    console.log(uid)
    const invitaciones = await registro_invitaciones.findAll({
        where: { uid: uid },
        include: [
            {
                model: diagrama,
                as: "did_diagrama",
                attributes: ['dnombre']
            },
            {
                model: invitacion,
                as: "iid_invitacion",
                attributes: ['iid', 'mensaje', 'rol'],
            }
        ],
        raw: true,   
        nest: true
    });

    console.log(invitaciones);
    return invitaciones;
}


async function User_Service_Accept_Invitation(uid, iid) {
    const transaction = await sequelize.transaction();

    try {
       
        const registroInv = await registro_invitaciones.findOne({
            where: { iid: iid, uid: uid },
            include: [{
                model: invitacion,
                as: "iid_invitacion"
            }],
            transaction
        });

        if (!registroInv) {
            throw new Error("La invitación no existe o no pertenece a este usuario.");
        }

        const did = registroInv.did;
        const rolAsignado = registroInv.iid_invitacion?.rol || "Espectador";


        let participacionCreada = await participacion.create({
            did: did,
            uid: uid,
            rnombre: rolAsignado
        }, { transaction });

        const board = await participacionCreada.getDiagrama({
            raw: true,
            transaction
        });

        await invitacion.destroy({
            where: { iid: iid },
            transaction
        });

        await transaction.commit();
        console.log({ ok: true, message: "Invitación aceptada correctamente", did });
        return { ok: true, message: "Invitación aceptada correctamente", ...board};

    } catch (error) {
        await transaction.rollback();
        throw error;
    }
}

/**
 * Rechaza una invitación validando que pertenezca al usuario (uid).
 * Elimina la invitación de la base de datos
 *
 * @param {string|number} uid - Identificador del usuario que rechaza
 * @param {string|number} iid - Identificador de la invitación
 */
async function User_Service_Reject_Invitation(uid, iid) {
   
    const registroInv = await registro_invitaciones.findOne({
        where: { iid: iid, uid: uid }
    });

    if (!registroInv) {
        throw new Error("La invitación no existe o no pertenece a este usuario.");
    }


    await invitacion.destroy({
        where: { iid: iid }
    });

    return { ok: true, message: "Invitación rechazada correctamente" };
}




/**
 * Obtiene la lista completa de diagramas relacionados a un usuario y que esten marcados como favoritos
 *
 * @param {string|number} uid - Identificador único del usuario
 * 
 * @returns {Object} Lista de diagramas y relaciones
 */
async function User_Service_Favorite_Board(uid) {
    let Boards = await participacion.findAll({ where: { uid: uid, es_favorito: true }, include: diagrama })

    console.log(Boards)

    return Boards;
}


/**
 * Alterna el estado de favorito en la relacion diagrama - usuario

 * @param {string|number} uid - Identificador único del usuario (User ID).
 * @param {string|number} did - Identificador único del tablero/diagrama (Diagram ID).
 * 
 * @returns {Object} Mensaje de confirmación
 */
async function User_Service_Change_Favorite(uid, did) {
    let board = await participacion.findOne({ where: { uid: uid, did: did } });
    if (!board) {
        throw new Error("Tablero no encontrado");
    }

    //no importa el rol del usuario, puede cambiar el estado de favorito
    board.es_favorito = !board.es_favorito;

    await board.save();
    return { message: "Estado de favorito cambiado correctamente" };
}


module.exports = { User_Service_Create_Board, User_Service_Delete_Board, User_Service_Get_Boards, User_Service_Invitations, User_Service_Favorite_Board, User_Service_Change_Favorite, User_Service_Accept_Invitation, User_Service_Reject_Invitation };