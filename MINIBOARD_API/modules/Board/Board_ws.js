const { sequelize } = require("../../server/database/conexion.js");


const participacion = sequelize.models.participacion;
const columna = sequelize.models.columna
const tarjeta = sequelize.models.tarjeta



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
    socket.on('cargar_D', async (msg, callback) => {
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
                    model: tarjeta
                }],
                order: [
                    ['orden', 'ASC'],           
                    [tarjeta, 'orden', 'ASC']    
                ]
            });
            console.log(Columnas)

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

    });

    /* Crea una nueva columna en el diagrama actual y notifica a todos los clientes en la sala.*/
    socket.on("create_C", async (msg) => {
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
    });

    /**
     * Crea una nueva tarjeta vinculada a una columna y difunde el evento a la sala.
     */
    socket.on("create_T", async (msg, callback) => {
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
                contenido: msg.contenido,
                color: msg.color
            });
            nuevaTarjeta = nuevaTarjeta.toJSON()

            io.to(`diagrama_${socket.datos.DID}`).emit("tarjeta_creada", nuevaTarjeta);


        } catch (error) {
            console.error(error);
            socket.emit("error", "Error creando tarjeta");


        }
    });

    /**
     * Cambia la columna (cid) a la que esta asociada una tarjeta
     */
    socket.on("cambiar_col", async (msg) => {
        console.log("cambiar_col")
        try {
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


            //reorganizar el orden de la nueva col
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
    });

    /**
     * Actualiza el orden (posiciones) de un grupo de tarjetas dentro de una columna.
     */
    socket.on("reorganizar", async (msg) => {

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
    });

    /**
     *Actualiza el orden (posiciones) de las columnas
     */
    socket.on("reorganizarC", async (msg) => {
        let id = []
        // 1. Iniciamos la transacción de la base de datos
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
    });

    //elimina una tarjeta 
    socket.on("eliminar_tarjeta", async (msg) => {
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
    })

    //elimina una columna
    socket.on("eliminar_columna", async (msg) => {
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
    })

    //obtener el contenido de una tarjeta
    socket.on("content_tar", async (msg, callback) => {
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
    });

    //Actualiza el título de una columna existente 
    socket.on("UpdateT", async (msg) => {
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
    })

    //Modifica los atributos de una tarjeta (color, título, contenido)
    socket.on("editar_tar", async (msg, callback) => {
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

            io.to(`diagrama_${socket.datos.DID}`).emit("titulo_tar", { tid: msg.tid, titulo: msg.titulo })

            callback({ ok: true });


        } catch (error) {
            console.log(error);

            callback({ error: "Error al actualizar la tarjeta" });

            socket.emit("error", "Error al actualizar la tarjeta");

        }
    });
}






module.exports = Socket_Board;