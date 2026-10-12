const express = require('express');
const UserRouter = express.Router();
const UserController = require('./User_Controller');

//Rutas relativas al modulo de Usuarios

UserRouter.get('/Boards', UserController.User_Controller_Boards);
UserRouter.get('/Favorites', UserController.User_Controller_Favorite);
UserRouter.get("/Invitaciones",UserController.User_Controller_Invitations)


//opciones de usuario : crear o eliminar un diagrama ... 
UserRouter.post('/Create', UserController.User_Controller_Create);
UserRouter.post('/Delete', UserController.User_Controller_Delete);
UserRouter.post('/ChangueFavorite',UserController.User_Controller_Change_Favorite);
UserRouter.post('/Aceptar_inv',UserController.User_Controller_Accept)
UserRouter.post('/Rechazar_inv',UserController.User_Controller_Accept)


module.exports = UserRouter;