const express = require('express');
const LoginRouter = express.Router();
const LoginController = require('./Login_Controller');

//Rutas relativas al modulo de Login

LoginRouter.post('/Register', LoginController.Login_Controller_Register);

LoginRouter.post('/Login', LoginController.Login_Controller_Login);


module.exports = LoginRouter;