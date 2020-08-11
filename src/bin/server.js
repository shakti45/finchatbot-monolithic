// Setup basic express server
require('dotenv').config({path:'../finchatbot-chatbotMonolithic/.env'})
var express = require('express');
var {app} = require('../middleware/express/app')
var server = require('http').createServer(app)
var io = require('socket.io')(server)
var path = require('path')


var {port} = require('../vars') 
let session = require("express-session")({
  secret: "some-little-secret",
  resave: true,
  saveUninitialized: true
}),
sharedsession = require("express-socket.io-session")
let {getNLP} = require('../services/processNLPService')

let trainNLP = async() =>{
    let nlp = await getNLP()
    await nlp.train()
}
trainNLP()

app.use(session)

app.use(express.static(path.join(__dirname, '/../../public')));
io.use(sharedsession(session))
require('../services/socketService')(io)
server.listen(port, () => {
  console.log('Server listening at port %d', port);
});





