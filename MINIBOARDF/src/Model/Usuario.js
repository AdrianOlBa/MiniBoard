/**
 * Modelo de un usuario
 */
export class Usuario {
    /**Modo actual del usuario*/
    mode = "Login";
    /**Datos del usuario*/
    usuario = "";


    /**
     * Registra un nuevo usuario
     * @param {Object} datos - Datos a registrar.
     * @returns {Promise<Object>} 
     */
    async Registrar(datos) {
        let resp_serv = await (await fetch('http://localhost:3000/Auth/Register', { method: "POST", headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(datos) })).json();
        return resp_serv
    }

    /**
     * Inicia sesión y recibe un token de acceso
     * @param {Object} datos - Datos para validae
     * @returns {Promise<Object>} Token de acceso o error
     */
    async Login(datos) {
        let resp_serv = await (await fetch('http://localhost:3000/Auth/Login', { method: "POST", headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(datos) })).json();
        return resp_serv
    }

    /**
     * Cierra la sesión actual del usuario.
     */
    Cerrar_Sesion() { }

}


