const Login_Service = require('./Login_Services');

/**
 * Extrae datos del body de la request y
 * Devuelve los datos del usuario y un token de acceso
 * @param {Request} req 
 * @param {Response} res 
 * @param {next} next 
 * @returns 
 */
async function Login_Controller_Login(req, res, next) {
  console.log(req.body)
  let token
  let [correo, password] = [req.body.correo, req.body.password]
  if (!correo || !password) {
    let error = new Error("faltan datos");
    next(error);
  }
  let usuario = await Login_Service.Login_Service_Login(correo, password);

  if (usuario.err) {
    next(usuario.err);
    return
  } else {
    token = Login_Service.Generar_Sesion(usuario.uid, usuario.nombre, usuario.correo)
  }

  res.json({ uid: usuario.uid, correo: usuario.correo, nombre: usuario.nombre, token })
}


/**
 * Extrae datos del body de la request y Registra a los usuarios 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
async function Login_Controller_Register(req, res, next) {
  console.log(req.body)
  let [nombre, correo, password] = [req.body.nombre, req.body.correo, req.body.password];

  if (!nombre || !correo || !password) {
    let error = new Error("faltan datos");
    next(error);
    return
  }

  let respuesta = await Login_Service.Login_Service_Register(nombre, correo, password);

  if (respuesta.err) {
    next(respuesta.err);
    return;
  } else {
    res.json({ respuesta: "usuario insertado correctamente" })
  }



}

module.exports = { Login_Controller_Login, Login_Controller_Register }