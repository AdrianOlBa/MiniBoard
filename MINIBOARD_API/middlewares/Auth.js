const jwt = require('../utilities/jwt.js');


const decoder = (req, res, next) => {
    if (!req.headers.token) {
        next(new Error("No autorizado , enviar un token"))
    }

    const token = req.headers.token;
    console.log(token)

    try {
        const Respuesta = jwt.Evaluar_jwt(token);
        if (!Respuesta.validez) { throw new Error("token incorrecto") }


        req.user = Respuesta.datos
        console.log(Respuesta.payload)
        console.log(req.user)
        next();
    } catch (error) {
        console.log("error con el token");
        next(error)
    }



};

module.exports = decoder;