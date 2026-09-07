const express = require('express');
const BoardRouter = express.Router();
const BoardController = require('./Login_Controller');

//Rutas relativas al modulo de Login

BoardRouter.get('/BoardData', BoardController.Board_Controller_Data);

module.exports = BoardRouter;