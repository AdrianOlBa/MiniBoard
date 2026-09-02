const { sequelize } = require('../../server/database/conexion.js');
const diagrama = sequelize.models.diagrama;
const participacion = sequelize.models.participacion;


async function User_Service_Create_Board(dnombre, color, uid) {
    let nuevoDiagrama;
        nuevoDiagrama = await diagrama.create({ dnombre, color });
        let nuevo_registro = await participacion.create({ did: nuevoDiagrama.did, uid: uid, rnombre: "Administrador" });
        nuevoDiagrama.setDataValue("Rol", nuevo_registro.rnombre);

    return { diagrama: nuevoDiagrama };
}

async function User_Service_Delete_Board(did, uid) {
    let usuario = await participacion.findOne({ where: { did: did, uid: uid } });
    console.log(usuario)

    if (!usuario) {
        throw new Error("Usuario no encontrado" );
    }

    if (usuario.rnombre === "Administrador") {

        await diagrama.destroy({
            where: {
                did: did,
            },
        });

    } else {
        throw new Error("No tienes permisos para eliminar este diagrama");
    }


}

async function User_Service_Get_Boards(uid) {
    let Boards = await participacion.findAll({ where: { uid: uid } })
    console.log(Boards)
    return Boards;
}

async function User_Service_Favorite_Board(uid) {
    let Boards = await participacion.findAll({ where: { uid: uid, es_favorito: true } })
    console.log(Boards)
    return Boards;
}

async function User_Service_Change_Favorite(uid, did) {
    let board = await participacion.findOne({ where: { uid: uid, did: did } });
    if (!board) {
        throw new Error("Tablero no encontrado");
    }
    //no importa el rol del usuario, puede cambiar el estado de favorito
    board.es_favorito = !board.es_favorito;

    await board.save();

}


module.exports = { User_Service_Create_Board, User_Service_Delete_Board, User_Service_Get_Boards, User_Service_Favorite_Board ,User_Service_Change_Favorite};