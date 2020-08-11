const {getActionService} = require('../services')
let {userService} = require('../services')
let {getRequestFormat,getResponseFormat, getLogFormat} = require('../helper/Formatter')
// let formatter = new Format()
module.exports = function(io) {
  var timer
  var numUsers = 0
  io.on('connection', (socket) => {
    var addedUser = false;

    
    // when the client emits 'new message', this listens and executes
    socket.on('create message', async (data) => {
      // we tell the client to execute 'new message'
      
      clearTimeout(timer)
      console.log('event',socket)
      


      console.log('username',data,socket.handshake.session.username)

      let request = await getRequestFormat('create Message',data,socket)
      await userService.saveConversation(socket.handshake.session.username,request)    
      
      timer = setTimeout(
        async(data = 'Is there anything else I can do to help you')=>{
          
          let response = await getResponseFormat('new Message',data,socket)
          await userService.saveConversation(socket.handshake.session.username,response)
      
      
      
          socket.emit('new message', response);
        },10000);

      

      let response = await getResponseFormat('new Mesaage',data,socket)
      await userService.saveConversation(socket.handshake.session.username,response)
    
      socket.emit('new message', response);
    });

    // when the client emits 'add user', this listens and executes
    socket.on('add user', async(username) => {
      if (addedUser) return;
      await userService.onBoardUser(username)
      console.log('ónboard')

      // we store the username in the socket session for this client
      socket.username = username
      socket.handshake.session.username = username;
      socket.id = await userService.getSession(socket.handshake.session.username)
      socket.handshake.session.id = socket.id
      socket.handshake.session.save()
      let log = await getLogFormat('add user',socket,true)
      await userService.saveConversation(socket.handshake.session.username,log)
      ++numUsers;
      addedUser = true;
      socket.emit('login', {
        numUsers: numUsers
      })
    })

    // when the client emits 'typing', we broadcast it to others

    // when the user disconnects.. perform this
    socket.on('disconnect', async() => {
      if (addedUser) {
        --numUsers;
        if (socket.handshake.session.username) {
          let log= await getLogFormat('disconnect',socket,false)
          await userService.saveConversation(socket.handshake.session.username,log) 
          await userService.saveSession(socket.handshake.session.username)
          delete socket.handshake.session.username
          socket.handshake.session.save();
      }
      }
    })
  })
}