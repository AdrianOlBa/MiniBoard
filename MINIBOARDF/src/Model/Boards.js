export class Board {


    /**
    * Elimina un diagrama.
    * 
    * @param {string} token - Token de autenticación del usuario.
    * @param {Object} datos - Datos para identificar el diagrama a borrar.
    * @returns {Promise<Object>}} Respuesta del servidor.
    */
    async Delete_Diagrama(token, datos) {

        let resp_serv = await (await fetch('http://localhost:3000/User/Delete', { method: "POST", headers: { 'Content-Type': 'application/json', token: token }, body: JSON.stringify(datos) })).json();

        return resp_serv

    }


    /**
     * Crea un nuevo diagrama.
     * 
     * @param {string} token - Token de autenticación del usuario.
     * @param {Object} datos - Nombre y color del nuevo diagrama.
     * @returns {Promise<Object>} Respuesta del servidor con el diagrama creado.
     */
    async Add_Diagrama(token, datos) {
        console.log(datos)
        let resp_serv = await (await fetch('http://localhost:3000/User/Create', { method: "POST", headers: { 'Content-Type': 'application/json', token: token }, body: JSON.stringify(datos) })).json();
        return resp_serv
    }

    /**
     * Marca o desmarca un diagrama como favorito.
     * 
     * @param {string} token - Token
     * @param {Object} datos - ID del diagrama a actualizar.
     * @returns {Promise<Object>} Respuesta del servidor.
     */
    async Change_Favorite_Diagrama(token, datos) {
        let resp_serv = await (await fetch('http://localhost:3000/User/ChangueFavorite', { method: "POST", headers: { 'Content-Type': 'application/json', token: token }, body: JSON.stringify(datos) })).json();
        return resp_serv
    }


}