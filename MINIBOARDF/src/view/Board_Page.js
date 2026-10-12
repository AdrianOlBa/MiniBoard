
import { Columna_Board } from "./Components_Board/Columna_Board.js";
import { Error_Notification } from "./Components_Board/Error.js";
import { Modal_Add_Column } from "./Components_Board/Modal_AddC.js";
import { Modal_Add_Tarjeta } from "./Components_Board/Modal_AddT.js";
import { Modal_users } from "./Components_Board/Modal_users.js";
import { Modal_Editar } from "./Components_Board/ModalEditar.js";
import { Tarjeta_Board } from "./Components_Board/Tarjeta_Board.js";


/**
 * Construye la vista del tablero.
 * Prepara sus modales, eventos y funciones para gestionar columnas y tarjetas
 * @param {Object} props acciones del tablero
 * @returns {Object} Métodos para renderizar y actualizar la vista.
 */
export function Board_Page(props) {
    let tablero_datos = {}
    const root = document.createElement("div");

    const ModalAddColumn = Modal_Add_Column(props)
    const ModalAddTarjeta = Modal_Add_Tarjeta(props)
    const ModalEditar = Modal_Editar(props)
    const ModalUser = Modal_users(props)
    const error = Error_Notification()


    let sortable = ""
    //pasar por referencia


    /**
     * Agrega una columna o tarjeta a la vista.
     * @param {Object} datos Datos del elemento.
     * @param {string} item Tipo de elemento
     * @param {string} rol Rol del usuario actual.
     * @returns {void}
     */
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

    /**
     * Elimina una columna o tarjeta de la vista.
     * Busca el elemento por su id y lo destruyes
     * @param {string} item Tipo de elemento
     * @param {string} id Id
     */
    const delItem = (item, id) => {
        if (item === "col") {
            const colEl = root.querySelector(`.columna-kanban[data-cid="${id}"]`);
            console.log(colEl)
            colEl.destroy();
        } else if (item === "tar") {
            const tarEl = root.querySelector(`[data-tid="${id}"]`);
            tarEl.destroy();
        }
    };
    /**
     * funcion Listener para eliminacion de elementos
     * @param {Event} e evento click
     */
    let handleclick = (e) => {

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


    }

    /**
     * Renderiza el tablero dentro de un contenedor.
     * @param {HTMLElement} container Contenedor donde se monta la vista.
     * @param {Object} did Datos del tablero.
     * @param {string} rol Rol de usuario
     */
    const render = (container, { did }, rol) => {
        root.id = "Board-Grid"
        root.className = "d-flex d-flex-nowrap h-100 ps-5"
        tablero_datos = {}


        root.addEventListener("click", handleclick)



        ModalAddColumn.render(root, rol)
        ModalAddTarjeta.render(root)
        ModalEditar.render(root)
        ModalUser.render(root)
        error.render(root)


        sortable = new Sortable(root, {
            animation: 150,
            ghostClass: 'blue-background-class',
            dataIdAttr: "data-cid",
            draggable: ".columna-kanban",
            disabled: (rol === "Espectador"),
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

                    root.insertBefore(columna, btnAgregar);
                }
            });
        };




        container.innerHTML = "";
        container.appendChild(root)
        root.dataset.did = did
    }

    /**
     * Construye las columnas y tarjetas recibidas en el tablero.
     * @param {Object} msg Datos del tablero
     * @returns {void}
     */
    const build = (msg) => {
        console.log(msg)
        //configurar el rol actual para el renderizado
        ModalUser.config({ rol: msg.Rol })
        console.log(tablero_datos)
        let board = msg.Columnas
        if (board) {
            for (let columna of board) {
                addItem(columna, "columna", msg.Rol)

                if (columna.tarjeta) {
                    for (let tarjeta of columna.tarjeta) {
                        addItem(tarjeta, "tarjeta", msg.Rol)
                    }
                }
            }
        }

    }


    /**
     * Desmonta la vista del tablero.
     * Destruye Sortable, quita el elemento raíz y elimina su listener.
     * @returns {void}
     */
    const destroy = () => {
        console.log("Destruyendo Board_Page")
        console.log(sortable)
        if (sortable) {
            try {
                sortable.destroy();
            } catch (e) {
                console.log("Sortable ya estaba destruido", e);
            }
            sortable = null;
        } else {
            console.log("No hay sortable para destruir")
        }
        console.log(root)

        if (root) {
            root.remove();
            root.removeEventListener("click", handleclick);
        }

        console.log(root)
    };



    /**
     * Actualiza el título de una columna.
     * @param {string} cid Id de la columna.
     * @param {string} titulo Nuevo título.
     * @returns {void}
     */
    const tituloC = (cid, titulo) => {
        let columna = root.querySelector(`[data-cid="${cid}"]`)
        columna.querySelector(".titulo-Board").value = titulo
    }

    /**
     * Actualiza el título y el color de una tarjeta.
     * Busca la tarjeta por id y modifica su titulo y estilo.
     * @param {string} tid Id de la tarjeta.
     * @param {string} titulo Nuevo título.
     * @param {string} color Nuevo color de fondo.
     */
    const Editar_Tarjeta = (tid, titulo, color) => {
        let tarjeta = root.querySelector(`.tarjeta-kanban[data-tid="${tid}"]`)
        console.log(tarjeta)
        console.log(tarjeta.querySelector(".titulo-tarjeta-kanban"))
        tarjeta.querySelector(".titulo-tarjeta-kanban").innerHTML = titulo;
        console.log(color)
        tarjeta.style.backgroundColor = color;
    }

    /**
     * Mueve una tarjeta de una columna a otra.
     * @param {string} tid ID de la tarjeta.
     * @param {string} cid_a ID de la columna de origen.
     * @param {string} cid_n ID de la columna de destino.
     */
    const cambiocol = (tid, cid_a, cid_n) => {
        const column_a = root.querySelector(`[data-cid="${cid_a}"] .content-col`)
        const column_n = root.querySelector(`[data-cid="${cid_n}"] .content-col`)
        const tarjeta = column_a.querySelector(`[data-tid="${tid}"]`)
        column_n.appendChild(tarjeta)
    }

    /**
     * Reordena las tarjetas de una columna.
     * @param {string} id Nuevo orden de ids.
     * @param {string} cid Id de la columna.
  
     */
    const reorganizarT = (id, cid) => {
        console.log(id)
        console.log(cid)
        let columna = root.querySelector(`[data-cid="${cid}"] .content-col`)
        console.log(columna.sort)
        columna.sort(id)
    }


    /**
     * Reordena las columnas del tablero.
     * @param {string} id nuevo orden de ids
   
     */
    const reorganizarC = (id) => {
        let board = root

        console.log(root.sort)
        board.sort(id)
    }


    return { render, addItem, build, destroy, delItem, tituloC, Editar_Tarjeta, reorganizarC, reorganizarT, cambiocol, error }
}