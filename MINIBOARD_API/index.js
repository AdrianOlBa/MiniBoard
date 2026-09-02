const express = require('express');

//const { sign } = require('jsonwebtoken')
//var jwt = require('jsonwebtoken');
var cors = require('cors')
//const crypto = require('crypto');
const { createServer } = require("http");
//const { Server } = require("socket.io");

//middlewares
const ErrorHandler = require('./middlewares/ErrorHandler');
const Auth = require('./middlewares/Auth');
//routes
const LoginRouter = require('./modules/Login/Login_Routes');
const UserRouter = require('./modules/Usuario/User_Router');

//////////////////////////////

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors())


app.use('/Auth',LoginRouter);

app.use(Auth)
app.use('/User',UserRouter)
//app.use();


//iniciar el servidor y el modulo de websocket
app.listen(3000, () => {
console.log('Servidor iniciado http://localhost:3000');
});

//app.use(Auth);
app.use(ErrorHandler);
module.exports = app;

