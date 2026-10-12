
const invitacion = require('../../database/models/invitacion');
const User_Service = require('./User_Services');


/**
 * Retorna la lista de tableros marcados como favoritos por el usuario 
 */
async function User_Controller_Favorite(req, res, next) {
  let usuario = req.user.payload
  let diagramas = await User_Service.User_Service_Favorite_Board(usuario.uid)
  console.log(diagramas)
  res.json(diagramas)
}

/**
 * Retorna la lista de tableros
 */
async function User_Controller_Boards(req, res, next) {
  let usuario = req.user.payload
  let diagramas = await User_Service.User_Service_Get_Boards(usuario.uid)
  res.json(diagramas)
}

/**
 * Retorna la lista de invitaciones pendientes para el usuario
 */
async function User_Controller_Invitations(req, res, next) {
  let usuario = req.user.payload
  let invitaciones = await User_Service.User_Service_Invitations(usuario.uid)
  console.log(invitaciones)
  res.json(invitaciones)
}
/**
 * Acepta una invitación pendiente para el usuario
 */
async function User_Controller_Accept(req, res, next) {
  let usuario = req.user.payload
  let aceptar = await User_Service.User_Service_Accept_Invitation(usuario.uid, req.body.iid)
  console.log(aceptar)
  res.json(aceptar)
}
/**
 * Rechaza una invitación pendiente para el usuario
 */
async function User_Controller_Reject(req, res, next) {
  let usuario = req.user.payload
  let reject = await User_Service.User_Service_Reject_Invitation(usuario.uid, req.body.iid)
  console.log(reject)
  res.json(reject)
}



/**
 * Crea un nuevo tablero en la base de datos asignando al usuario actual como Administrador.
 */
async function User_Controller_Create(req, res, next) {
  let usuario = req.user.payload
  let diagrama
  try {

    diagrama = await User_Service.User_Service_Create_Board(req.body.dnombre, req.body.color, usuario.uid)

  } catch (error) {

    return next(error.message)

  }
  res.json({ message: "diagrama creado correctamente", ...diagrama })
}



/**
 * Elimina un tablero específico 
 */
async function User_Controller_Delete(req, res, next) {
  let usuario = req.user.payload
  let diagrama
  console.log(req.body)
  console.log(usuario)

  try {
    diagrama = await User_Service.User_Service_Delete_Board(req.body.did, usuario.uid)
  } catch (error) {
    console.log(error)
    return next(error.message)
  }
  console.log("dbhjk sadbhjadsbjk ajk")

  res.json(diagrama)
}


/**
 * Alterna el estado de favorito del tablero indicado para el usuario
 */
async function User_Controller_Change_Favorite(req, res, next) {
  let usuario = req.user.payload
  let diagrama
  try {
    diagrama = await User_Service.User_Service_Change_Favorite(usuario.uid, req.body.did)
  } catch (error) {
    return next(error.message)
  }

  res.json(diagrama.message)
}



module.exports = { User_Controller_Boards, User_Controller_Invitations, User_Controller_Accept, User_Controller_Reject, User_Controller_Create, User_Controller_Delete, User_Controller_Favorite, User_Controller_Change_Favorite };