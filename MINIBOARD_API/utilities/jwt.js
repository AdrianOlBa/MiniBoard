const jwt = require('jsonwebtoken');
const { sign } = require('jsonwebtoken')
let secret = "contrasenya";

/**
 * Genera un JWT con los datos del usuario como payload
 * @param {Object} payload - datos para codificar el token
 * @returns {String} JWT
 */
function Generar_jwt(payload) {

    let token = jwt.sign(payload, secret, { expiresIn: '48h' });
    return token;
}

/**
 * Evaluar la validez de un JWT
 * @param {*} token 
 * @returns {Object} datos del usuario si es que el token es valido , validez del token 
 */
function Evaluar_jwt(token) {
    jwt.verify(token, secret);
    let datos = jwt.decode(token, { complete: true });
    return ({ datos })
}

module.exports = { Generar_jwt, Evaluar_jwt }
