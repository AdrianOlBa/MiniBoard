const { sequelize } = require("../../../server/database/conexion.js");
const columna = sequelize.models.columna
const tarjeta = sequelize.models.tarjeta



/**
 * Crea una columna en el diagrama.
 * Comprueba permisos, guarda la columna y emite su creación; 
 * @param {Object} msg Datos de la columna.
 * @param {Object} socket Conexión de usuario.
 * @param {Object} io Servidor de sockets.
 */
async function Create_col(msg, socket, io) {
    try {
        console.log("asjdjjsdn")
        console.log(socket.datos)
        console.log(msg)
        if (!socket.datos.permisos.mover) {
            socket.emit("error", "No puedes mover");
            return;
        }

        let nuevaColumna = await (columna.create({
            did: socket.datos.DID,
            cnombre: msg.cnombre,
            color: msg.color || "gray"
        }));

        nuevaColumna = (nuevaColumna.toJSON())
        io.to(`diagrama_${socket.datos.DID}`).emit("columna_creada",
            nuevaColumna
        );


    } catch (err) {

        console.error(err);
        socket.emit("error", "Error creando columna");
    }
}



/**
 * Mueve una tarjeta a otra columna.
 * Valida permisos, actualiza la columna y el orden, y emite el nuevo orden.
 * @param {Object} msg Datos de la tarjeta y de las columnas.
 * @param {Object} socket Conexión de usuario.
 */
async function Cambiar_col(msg, socket) {
    console.log("cambiar_col")
    try {

        if (!socket.datos.permisos.mover) {
            socket.emit("error", "No tienes permisos para mover objetos");
            return;
        }


        const { TID, CID_anterior, CID_nuevo } = msg;
        console.log(msg)

        const [filasAfectadas] = await tarjeta.update(
            { cid: CID_nuevo },
            {
                where: {
                    tid: TID,
                    cid: CID_anterior
                }
            }
        );
        console.log(filasAfectadas)
        if (filasAfectadas === 0) {
            return socket.emit("error", "No se encontro la tarjeta a mover");
        }

        socket.to(`diagrama_${socket.datos.DID}`).emit("cambiar_col", {
            TID,
            CID_anterior,
            CID_nuevo
        });


        const t = await sequelize.transaction();
        let id = []
        try {
            console.log(msg)

            const CID = msg.CID_nuevo
            const tarjetas = msg.tarjetas

            for (const item of tarjetas) {
                id.push(item.TID)
                await tarjeta.update(
                    { orden: item.Orden },
                    {
                        where: {
                            tid: item.TID,

                        },
                        transaction: t
                    }
                );
            }


            await t.commit();
            console.log(id)
            console.log("tarjetas_r")
            socket.to(`diagrama_${socket.datos.DID}`).emit("tarjetas_reorganizadas", {
                CID, id
            });

        } catch (error) {
            await t.rollback();
            console.error("Error al reorganizar tarjetas:", error);
            socket.emit("error_operacion", { mensaje: "No se pudo guardar el nuevo orden." });
        }




    } catch (error) {
        console.log(error)
        socket.emit("error", error);
    }
}

/**
 * Reordena las tarjetas de una columna.
 * Valida permisos, transacción: reasignacion de orden de tarjetas,  emite el nuevo orden
 * @param {Object} msg Datos de columna y nuevo orden de tarjetas.
 * @param {Object} socket Conexión de usuario.
 */
async function reorganizar(msg, socket) {

        if (!socket.datos.permisos.mover) {
            socket.emit("error", "No tienes permisos para mover tarjetas");
            return;
        }

    const t = await sequelize.transaction();
    let id = []
    try {
        console.log(msg)
        const { CID, tarjetas } = msg;

        for (const item of tarjetas) {
            id.push(item.TID)
            await tarjeta.update(
                { orden: item.Orden },
                {
                    where: {
                        tid: item.TID,

                    },
                    transaction: t
                }
            );
        }


        await t.commit();
        console.log(id)
        console.log("tarjetas_r")
        socket.to(`diagrama_${socket.datos.DID}`).emit("tarjetas_reorganizadas", {
            CID, id
        });

    } catch (error) {
        await t.rollback();
        console.error("Error al reorganizar tarjetas:", error);
        socket.emit("error_operacion", { mensaje: "No se pudo guardar el nuevo orden." });
    }
}

/**
 * Reordena las columnas del diagrama.
 * Valida permisos, transaccion: reorden de columnas, emite el nuevo orden de columnas.
 * @param {Array} msg Columnas y sus nuevas posiciones.
 * @param {Object} socket Conexión que realiza la operación.
 */
async function reorganizar_col(msg, socket) {
    let id = []

        if (!socket.datos.permisos.mover) {
            socket.emit("error", "No tienes permisos para mover columnas");
            return;
        }

    const t = await sequelize.transaction();

    try {
        console.log("columnasss")
        console.log(msg)

        for (const item of msg) {
            console.log(item)
            id.push(item.CID)
            await columna.update(
                { orden: item.Orden },
                {
                    where: {
                        cid: item.CID,

                    },
                    transaction: t
                }
            );
        }


        await t.commit();
        console.log(id)


        socket.to(`diagrama_${socket.datos.DID}`).emit("columnas_reorganizadas", {
            id
        });

    } catch (error) {

        await t.rollback();
        console.log("Error al reorganizar columnas:", error);
        socket.emit("error_operacion", { mensaje: "No se pudo guardar el nuevo orden." });
    }
}


/**
 * Elimina una columna del diagrama.
 * Valida permisos, elimina el registro y emite los datos de la columna eliminada.
 * @param {Object} msg Datos de la columna a eliminar.
 * @param {Object} socket Conexión de usuario.
 * @param {Object} io Servidor de sockets.
 */
async function eliminar_columna(msg, socket, io) {
    try {
        if (!socket.datos.permisos.mover) {
            socket.emit("error", "No tienes permisos para eliminar");
            return;
        }
        console.log("mensaje");
        console.log(msg);

        let result = await columna.destroy({
            where: { cid: msg.cid }
        });


        io.to(`diagrama_${socket.datos.DID}`).emit("columna_eliminada", msg.cid);

    } catch (error) {
        console.log(error);

        socket.emit("error", "Error al eliminar la columna");
    }
}


/**
 * Actualiza el título de una columna.
 * Valida permisos, guarda el nuevo título y lo emite al diagrama.
 * @param {Object} msg Identificador y nuevo título de la columna.
 * @param {Object} socket Conexión de usuario.
 * @param {Object} io Servidor de sockets.
 
 */
async function actualizarTituloCol(msg, socket, io) {
    console.log("actualizacion titulooooooooo")
    try {
        if (!socket.datos.permisos.mover) {
            socket.emit("error", "No tienes permisos para editar");
            return;
        }

        console.log(msg)
        let update = await columna.update(
            { cnombre: msg.titulo },
            { where: { cid: msg.cid } }
        );
        console.log(update)

        io.to(`diagrama_${socket.datos.DID}`).emit("titulo_col", { cid: msg.cid, titulo: msg.titulo })

    } catch (error) {
        console.log(error);

        socket.emit("error", "Error al actualizar la tarjeta");

    }
}


module.exports = { Create_col, Cambiar_col, reorganizar, reorganizar_col, eliminar_columna, actualizarTituloCol }