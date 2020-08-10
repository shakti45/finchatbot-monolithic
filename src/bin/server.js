// Setup basic express server
require('dotenv').config({path:'../finchatbot-chatbotMonolithic/.env'})
var express = require('express');
var app = express();
var path = require('path');
var server = require('http').createServer(app);
var io = require('socket.io')(server);
const rootRoute = require('../routes')
const errorHandler = require('../middleware/errorHandler')

var {port,botname} = require('../vars') 
let session = require("express-session")({
  secret: "my-secret",
  resave: true,
  saveUninitialized: true
}),
sharedsession = require("express-socket.io-session");
let {getNLP} = require('../config/processNLP')
// const {getActionService} = require('../services')
// let {userService} = require('../services');

let trainNLP = async() =>{
    let nlp = await getNLP()
    await nlp.train()
}
trainNLP()

//session
app.use(session)
app.use('/api',rootRoute)
app.use(errorHandler)
// Routing
app.use(express.static(path.join(__dirname, '/../../public')));
io.use(sharedsession(session))
require('../services/socketService')(io)
server.listen(port, () => {
  console.log('Server listening at port %d', port);
});





