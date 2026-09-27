
import { Columna_Board } from "./Components_Board/Columna_Board.js";
import { Modal_Add_Column } from "./Components_Board/Modal_AddC.js";
import { Modal_Add_Tarjeta } from "./Components_Board/Modal_AddT.js";
import { Modal_Editar } from "./Components_Board/ModalEditar.js";
import { Tarjeta_Board } from "./Components_Board/Tarjeta_Board.js";


export function Board_Page(props) {
    const root = document.createElement("div");
    const ModalAddColumn = Modal_Add_Column(props)
    const ModalAddTarjeta = Modal_Add_Tarjeta(props)
    const ModalEditar = Modal_Editar(props)
    let sortable

    const addItem = (datos, item, rol) => {
        if (item === "columna") {
            let columna = Columna_Board(props, datos, rol)
            columna.render(root)
        } else if (item === "tarjeta") {
            console.log(datos)
            const columna = root.querySelector(`.columna-kanban[data-cid="${datos.cid}"]`);
            let tarjeta = Tarjeta_Board(datos, rol)
            tarjeta.render(columna.querySelector(".content-col"))
        }
    }

    const delItem = (item, id) => {
        if (item === "col") {
            const colEl = root.querySelector(`[data-cid="${id}"]`);
            colEl.destroy();
        } else if (item === "tar") {
            const tarEl = root.querySelector(`[data-tid="${id}"]`);
            tarEl.destroy();
        }
    };

    const render = (container, { did }) => {
        root.id = "Board-Grid"
        root.className = "d-flex d-flex-nowrap h-100 ps-5"

        root.addEventListener("click", (e) => {

            if (e.target.closest(".eliminar-col")) {
                console.log("eliminarcol")
                let cid = (e.target.closest(".columna-kanban").dataset.cid)
                props.onDelete({ cid, type: "Col" })
            }

            if (e.target.closest(".eliminar-tar")) {
                console.log("eliminartar")
                let tid = (e.target.closest(".tarjeta-kanban").dataset.tid)
                props.onDelete({ tid, type: "Tar" })
            }


        })



        ModalAddColumn.render(root)
        ModalAddTarjeta.render(root)
        ModalEditar.render(root)


        sortable = new Sortable(root, {
            animation: 150,
            ghostClass: 'blue-background-class',
            dataIdAttr: "data-cid",
            draggable: ".columna-kanban",
            onUpdate: function (e) {
                const CID = e.item.dataset.cid;
                const columnas = this.toArray().map((CID, index) => ({
                    CID,
                    Orden: index
                }));
                console.log(columnas)
                //actualizar el servidor
                props.reorganizarC(columnas)
                console.log("modificacion interna c")
            }
        });

        //ordenar columnas segun un orden de cid
        root.sort = (order) => {
         

            const btnAgregar = root.querySelector(".agregar-Columna");


            order.forEach((cid) => {
                const columna = root.querySelector(`.columna-kanban[data-cid="${String(cid)}"]`);
                if (columna && btnAgregar) {

                    root.insertBefore(columna);
                }
            });
        };




        container.innerHTML = "";
        container.appendChild(root)
        root.dataset.did = did
    }

    const build = (msg) => {
        let board = msg.Columnas

        for (let columna of board) {
            addItem(columna, "columna", msg.Rol)

            if (columna.tarjeta) {
                for (let tarjeta of columna.tarjeta) {
                    addItem(tarjeta, "tarjeta", msg.Rol)
                }
            }
        }

    }
    const destroy = () => {
        root.remove();
        sortable.destroy()
    }
    const tituloC = (cid, titulo) => {
        let columna = root.querySelector(`[data-cid="${cid}"]`)
        columna.querySelector(".titulo-Board").value = (titulo + "asda")
    }
    const tituloT = (tid, titulo) => {
        let tarjeta = root.querySelector(`.tarjeta-kanban[data-tid="${tid}"]`)
        console.log(tarjeta)
        console.log(tarjeta.querySelector(".titulo-tarjeta-kanban"))
        tarjeta.querySelector(".titulo-tarjeta-kanban").innerHTML = titulo;
    }

    const cambiocol = (tid, cid_a, cid_n) => {
        const column_a = root.querySelector(`[data-cid="${cid_a}"] .content-col`)
        const column_n = root.querySelector(`[data-cid="${cid_n}"] .content-col`)
        const tarjeta = column_a.querySelector(`[data-tid="${tid}"]`)
        column_n.appendChild(tarjeta)
    }

    const reorganizarT = (id, cid) => {
        console.log(id)
        console.log(cid)
        let columna = root.querySelector(`[data-cid="${cid}"] .content-col`)
        console.log(columna.sort)
        columna.sort(id)
    }
    const reorganizarC = (id) => {
        let board = root

        console.log(root.sort)
        board.sort(id)
    }


    return { render, addItem, build, destroy, delItem, tituloC, tituloT, reorganizarC, reorganizarT, cambiocol }
}