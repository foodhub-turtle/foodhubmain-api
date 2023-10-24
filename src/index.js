//import express for api
import express from "express";
//import morgan for middleware
import morgan from "morgan";
//import dotenv for .env
import dotenv from "dotenv";
import "core-js/stable";
import "regenerator-runtime/runtime";
//import dotenv for cookie parser
// import cookieParser from "cookie-parser";

//import routes
import apiRouter from "./routes/index.js";

//import error handlers
import errorHandler from "./libs/globalErrorHandler.js";
import GlobalError from "./libs/globalError.js";
import { async } from "regenerator-runtime";
require("pg").defaults.parseInt8 = true;

global.__basedir = __dirname;
//For cors access
const cors = require("cors");
var bodyParser = require('body-parser');
// const session = require('express-session');
const passport = require('passport');
const passportConfig = require('./config/passport')(passport);

const listEndpoints = require("express-list-endpoints"); // npm i express-list-endpoints

var corsOptions = {
  origin: "*"
};
//initiating express
const app = express();
const server = require('http').createServer(app);
const socketIO = require('socket.io')(server, {
  cors: {
    origin: '*'
  }
});
//config dotenv
dotenv.config();
// const websocket = require('ws');


//we are passing morgan as middleware
app.use(morgan("start")); // line 5
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));
app.use(passport.initialize());
// app.use(passport.session());
// Add the line below, which you're missing:
//app.use(cookieParser()); // cookie parse middleware to access the cookie object

// database
const db = require("./models");
const Role = db.role;

var users = [];
//SocketIO connection
socketIO.on('connection', function (socket) {
  
  socket.on('connected', function (order) { 
    socket.join(order.room);
    console.log('room', socket.rooms);
    console.log('data', order);

  });

  socket.on('onStatusEvent', function (data) {
    
      console.log('data', socket.rooms);
      socket.to(data.room).emit('onStatusChange', data);
  });
});
// socketIO.on('connection', function (socket) {
  
//   socket.on('connected', function (order) { 
//     console.log('order',order,users.find(item => item.orderId == order.orderId));
//     if (!users.find(item => item.orderId == order.orderId)) {
//       users.push({orderId: order.orderId, customerId: order.customerId, branchId: order.branchId, socketId: socket.id});
//       users = users.map((user) => {
//         if (user.orderId == order.orderId) {
//           if (user.socketId != order.socketId) {
//             user.socketId = order.socketId;
//           }
//         }
//         return user;
//       });
//     }
//     // users[orderId] = socket.id;
//     console.log('users', users);

//   });

//   // socket.emit('onStatusChange', 1);
//   // socket.emit('onStatusChange', 3);
//   socket.on('onStatusEvent', function (data) {
//     for (let index = 0; index < users.length; index++) {
//       const element = users[index];
//       console.log(users, data);
//       if (users.find(item => item.orderId == data.orderId)) {
//         let user = users.find(item => (item.orderId == data.orderId && item.customerId == data.customerId && item.branchId == data.branchId));
//         console.log('data',data, user);
//         // data.socketId = user.socketId;
//         // socketIO.emit('onStatusChange', data);
//         socket.broadcast.to(user.socketId).emit('onStatusChange', data);
//       }
//     }
//   });
// });
// simple route
app.get("/", (req, res) => {
  
  res.json({ message: "Welcome to Foodhub Delivery App." });
});
app.use(apiRouter);
//console.log(listEndpoints(app)); // where app = express();

app.all("*", async (req, res, next) => {
    const err = new GlobalError(
      `${req.originalUrl} does not exist on the server`,
      404
    );
    next(err);
});
  
app.use(errorHandler);

//use default port 4000
const PORT = process.env.PORT || 4000; //line 7

server.listen(PORT, () => {
  console.log(`server listen at port ${PORT}`);
 });
// app.listen(PORT, () => {
//  console.log(`server listen at port ${PORT}`);
// });

function initial() {
  Role.create({
    id: 1,
    name: "user"
  });
 
  Role.create({
    id: 2,
    name: "vendor"
  });
 
  Role.create({
    id: 3,
    name: "admin"
  });
  Role.create({
    id: 4,
    name: "rider"
  });
}