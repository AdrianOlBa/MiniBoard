const express = require('express');
const UserRouter = express.Router();
const UserController = require('./User_Controller');

//Rutas relativas al modulo de Usuarios

UserRouter.get('/Boards', UserController.User_Controller_Boards);
UserRouter.get('/Favorite', UserController.User_Controller_Favorite);

//opciones de usuario : crear o eliminar un diagrama ... 
UserRouter.post('/Create', UserController.User_Controller_Create);
UserRouter.post('/Delete', UserController.User_Controller_Delete);
UserRouter.post('/changueFavorite',UserController.User_Controller_Change_Favorite);



module.exports = UserRouter;