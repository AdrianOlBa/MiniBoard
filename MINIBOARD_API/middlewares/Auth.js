const jwt = require('../utilities/jwt.js');


const decoder = (req, res, next) => {
    const token = req.headers.token;
    console.log(token)

    if (!token) {
        next(new Error("No autorizado , enviar un token"))
        return
    }

    try {
        //soltara error si token incorrecto o expirado
        const Respuesta = jwt.Evaluar_jwt(token);
        req.user = Respuesta.datos
        console.log(req.user)
        next();
        return;
    } catch (error) {
        console.log("error con el token");
        error.message = "No autorizado , token incorrecto o expirado"
        next(error)
        return
    }



};

module.exports = decoder;