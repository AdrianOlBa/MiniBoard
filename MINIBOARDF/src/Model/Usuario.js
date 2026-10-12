/**
 * Modelo de un usuario
 */
export class Usuario {
    /**Modo actual del usuario*/
    mode = "Login";
    usuario = "";
    constructor(token) {
        this.token = token
    }


    /**
     * Registra un nuevo usuario
     * @param {Object} datos  Datos a registrar.
     * @returns {Promise<Object>} 
     */
    async Registrar(datos) {
        let resp_serv = await (await fetch('http://localhost:3000/Auth/Register', { method: "POST", headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(datos) })).json();
        return resp_serv
    }

    /**
     * Inicia sesión y recibe un token de acceso
     * @param {Object} datos Datos para validae
     * @returns {Promise<Object>} Token de acceso o error
     */
    async Login(datos) {
        let resp_serv = await (await fetch('http://localhost:3000/Auth/Login', { method: "POST", headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(datos) })).json();
        return resp_serv
    }

    /**
     * Obtiene los diagramas asociados al usuario autenticado.
     * @returns {Promise<Object>} Lista de diagramas del usuario 
     */
    async Get_Diagramas() {
        console.log(this.token)
        let Boards = await (await fetch('http://localhost:3000/User/Boards', { method: "GET", headers: { 'Content-Type': 'application/json', token: this.token } })).json();
      
        return Boards;
    }

    /**
     * Obtiene los diagramas marcados como favoritos por el usuario.
     * @returns {Promise<Object>} Lista de diagramas favoritos
     */
    async Get_Diagramas_Favoritos() {
        let Boards = await (await fetch('http://localhost:3000/User/Favorites', { method: "GET", headers: { 'Content-Type': 'application/json', token: this.token } })).json();
        return Boards;
    }

    /**
     * Recupera las invitaciones pendientes del usuario.
     * @returns {Promise<Object>} Invitaciones pendientes 
     */
    async invitaciones() {
        let invitaciones = await (await fetch('http://localhost:3000/User/Invitaciones', { method: "GET", headers: { 'Content-Type': 'application/json', token: this.token } })).json();
        return invitaciones
    }

    /**
     * Acepta una invitación de participación.
     * @param {string|number|Object} iid - Id de la invitación 
     * @returns {Promise<Object>}  Error o confirmación.
     */
    async Aceptar_inv(iid) {
        console.log(iid)
        let respuesta = await (await fetch('http://localhost:3000/User/Aceptar_inv', { method: "POST", headers: { 'Content-Type': 'application/json', token: this.token }, body: JSON.stringify(iid) })).json();
        console.log(respuesta)
        return respuesta
    }

    /**
     * Rechaza una invitación de participación.
     * @param {string|number|Object} iid - Id de la invitación a rechazar.
     * @returns {Promise<Object>} Error o confirmación.
     */
    async Rechazar_inv(iid) {
        let respuesta = await (await fetch('http://localhost:3000/User/Rechazar_inv', { method: "POST", headers: { 'Content-Type': 'application/json', token: this.token }, body: JSON.stringify(iid) })).json();
        console.log(respuesta)
        return respuesta
    }

    /**
     * Cierra la sesión actual del usuario.
     */
    Cerrar_Sesion() { }

}


