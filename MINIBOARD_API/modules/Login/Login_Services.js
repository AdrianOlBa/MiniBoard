const { sequelize } = require('../../server/database/conexion.js');
const bcrypt = require('bcrypt');
const jwt = require("../../utilities/jwt.js");


const usuarios = sequelize.models.usuarios;
const saltRounds = 10;

/**
 *  Registrar un uusario en la db a travez del modelo
 */
async function Login_Service_Register(nombre, correo, password) {
    password_h = await bcrypt.hash(password, saltRounds);

    try {
        const query = await usuarios.create({ nombre, correo, pass: password_h })
        console.log(query);
        return { query }
    }
    catch (err) {
        console.error(err.message);
        return { err }
    }

}

/**
 * Verificar si un Usuario existe
 * @param {*} correo 
 * @param {*} password 
 * @returns  Datos del usuario uid,nombre,correo,pass
 */
async function Login_Service_Login(correo, password) {
    let hash_pass;
    let query

    try {

        query = await usuarios.findOne({
            where: {
                correo: correo,
            },
        });

        if (!query) { throw new Error("Usuario no encontrado") };

        hash_pass = query.pass;

        let login = await bcrypt.compare(password, hash_pass);
        
        if (login) {
            return (query)
        } else {
            throw new Error("Contraseña o usuario incorrecto")
        }

    } catch (err) {
        console.error(err.message);
        return { err }
    }


}

function Generar_Sesion(uid, nombre, correo) {
    let token = jwt.Generar_jwt({ uid, nombre, correo })
    return token
}


module.exports = { Login_Service_Register, Login_Service_Login, Generar_Sesion }

