const express = require('express');
var cors = require('cors')
const { createServer } = require("http");
const { Server } = require("socket.io");
const app = express();
const httpServer = createServer(app);

//middlewares
const ErrorHandler = require('./middlewares/ErrorHandler');
const Auth = require('./middlewares/Auth');
//routes
const LoginRouter = require('./modules/Login/Login_Routes');
const UserRouter = require('./modules/Usuario/User_Router');
const Socket_Board = require("./modules/Board/Board_ws");
const { Evaluar_jwt } = require('./utilities/jwt');

//////////////////////////////


const io = new Server(httpServer, { cors: { origin: "*", methods: ["GET", "POST"] } });

io.use((socket, next) => {
    socket.datos = {}
    let token = socket.handshake.auth.token;
    try {
      
        const decoded = Evaluar_jwt(token)

        console.log(decoded)

        console.log("dsnjfsdfuijksdf ini")
        console.log(decoded)    
         console.log(decoded.datos.payload)    

        socket.datos.UID = decoded.datos.payload.uid
        socket.datos.Correo = decoded.datos.payload.correo
        socket.datos.Nombre = decoded.datos.payload.nombre

        next();
    } catch (error) {
        console.log("error con el token socket");
        next(error)
    }
});
io.on("connection", (Socket) => { Socket_Board(Socket, io) })



app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors())


app.use('/Auth', LoginRouter);

app.use(Auth)
app.use('/User', UserRouter)

//iniciar el servidor y el modulo de websocket
httpServer.listen(3000, () => {
    console.log('Servidor iniciado http://localhost:3000');
});


app.use(ErrorHandler);
module.exports = app;

