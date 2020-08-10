const {getActionService} = require('../services')
let {userService} = require('../services')
var {botname} = require('../vars') 
module.exports = function(io) {
  var timer
  var numUsers = 0
  io.on('connection', (socket) => {
    var addedUser = false;

    
    // when the client emits 'new message', this listens and executes
    socket.on('create message', async (data) => {
      // we tell the client to execute 'new message'
      
      clearTimeout(timer)
      


      console.log('username',data,socket.handshake.session.username)

      let request = {}
      request['from'] = socket.handshake.session.username
      request['to'] = botname
      request['text'] = data
      request['timestamp'] = new Date()
      request['sessionID'] = await userService.getSession(socket.handshake.session.username)
      request['sessionStatus'] = true
      request['event'] = 'create Message'
      await userService.saveConversation(socket.handshake.session.username,request)    
      
      timer = setTimeout(
        async(data = 'Is there anything else I can do to help you')=>{
          let response = {}
          response =  await getActionService.getAction(String(data))
          response['template'] = response['intent'].split('.')[0]
          let result = await userService.getIntentResult(response['intent'],String(socket.handshake.session.username))
          response['data'] = (result) ? result : null
          response['sessionID'] = await userService.getSession(socket.handshake.session.username)
          response['timestamp'] = new Date()
          response['sessionStatus'] = true
          response['event'] = 'new Message'
          response['from'] = botname
          response['to'] = String(socket.handshake.session.username)
          await userService.saveConversation(socket.handshake.session.username,response)
          console.log('type of response', typeof response)
          // return response
      
      
      
          socket.emit('new message', response);
        },10000);
      // })
      let response = {}

      // response['username'] = response['to']
      
      
      response =  await getActionService.getAction(String(data))
      response['template'] = response['intent'].split('.')[0]
      let result = await userService.getIntentResult(response['intent'],String(socket.handshake.session.username))
      response['data'] = (result) ? result : null
      response['sessionID'] = await userService.getSession(socket.handshake.session.username)
      response['timestamp'] = new Date()
      response['sessionStatus'] = true
      response['event'] = 'new Message'
      response['from'] = botname
      response['to'] = String(socket.handshake.session.username)
      await userService.saveConversation(socket.handshake.session.username,response)
      console.log('type of response', typeof response)
      // return response

  

      socket.emit('new message', response);
    });

    // when the client emits 'add user', this listens and executes
    socket.on('add user', async(username) => {
      if (addedUser) return;
      await userService.onBoardUser(username)
      console.log('ónboard')

      // we store the username in the socket session for this client
      socket.username = username;
      // socket.id = await userService.getSession(socket.handshake.session.username)
      socket.handshake.session.username = username;
      socket.handshake.session.save();
      console.log('starting session',socket.handshake.session.username)
      let response = {}
      response['sessionID'] = await userService.getSession(socket.handshake.session.username)
      response['timestamp'] = new Date()
      response['sessionStatus'] = true
      response['event'] = 'add user'
      await userService.saveConversation(socket.handshake.session.username,response)
      ++numUsers;
      addedUser = true;
      socket.emit('login', {
        numUsers: numUsers
      });
    });

    // when the client emits 'typing', we broadcast it to others

    // when the user disconnects.. perform this
    socket.on('disconnect', async() => {
      if (addedUser) {
        --numUsers;
        if (socket.handshake.session.username) {
          let response = {}
          response['sessionID'] = await userService.getSession(socket.handshake.session.username)
          response['timestamp'] = new Date()
          response['sessionStatus'] = false
          response['event'] = 'disconnect'
          let lastEvent = await userService.getLastEvent(socket.handshake.session.username,response['sessionID'])
          // console.log('last event',lastEvent)
          if(lastEvent['event']=='add user'&&lastEvent['sessionStatus']==true){
            response['droppedOff'] = true
          }
          await userService.saveConversation(socket.handshake.session.username,response) 
          await userService.saveSession(socket.handshake.session.username)
          delete socket.handshake.session.username
          socket.handshake.session.save();
      }
      console.log('closed session',socket.handshake.session)
      }
    });
  });
}