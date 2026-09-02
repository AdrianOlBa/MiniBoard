
const User_Service = require('./User_Services');



async function User_Controller_Favorite(req, res, next) {
  let usuario = req.user.payload
  let diagramas = await User_Service.User_Service_Favorite_Board(usuario.uid)
  console.log(diagramas)
  res.json(diagramas)
}

async function User_Controller_Boards(req, res, next) {
  let usuario = req.user.payload
  let diagramas = await User_Service.User_Service_Get_Boards(usuario.uid)
  console.log(diagramas)
  res.json(diagramas)
}

async function User_Controller_Create(req, res, next) {
  let usuario = req.user.payload
  let diagrama
  try {

    diagrama = await User_Service.User_Service_Create_Board(req.body.dnombre, req.body.color, usuario.uid)

  } catch (error) {

    return next(error.message)

  }
  res.json(diagrama)
}

async function User_Controller_Delete(req, res, next) {
  let usuario = req.user.payload
  let diagrama
  try {
    diagrama = await User_Service.User_Service_Delete_Board(req.body.did, usuario.uid)
  } catch (error) {
    return next(error.message)
  }
  res.json(diagrama)
}

async function User_Controller_Change_Favorite(req, res, next) {
  let usuario = req.user.payload
  let diagrama
  try {
    diagrama = await User_Service.User_Service_Change_Favorite(usuario.uid, req.body.did)
  } catch (error) {
    return next(error.message)
  }

  res.json(diagrama)
}



module.exports = { User_Controller_Boards, User_Controller_Create, User_Controller_Delete, User_Controller_Favorite, User_Controller_Change_Favorite };