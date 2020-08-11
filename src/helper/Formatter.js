const {getActionService} = require('../services')
let {userService} = require('../services')
var {botname} = require('../vars') 
let getRequestFormat = async(event,data,socket)=>{
    let request = {}
    request['from'] = socket.handshake.session.username
    request['to'] = botname
    request['text'] = data
    request['timestamp'] = new Date()
    request['sessionID'] = socket.handshake.session.id
    // await userService.getSession(socket.handshake.session.username)
    request['sessionStatus'] = true
    request['event'] = event
    return request
    }
let getResponseFormat = async(event,data,socket)=>{
    let response = {}
    response =  await getActionService.getAction(String(data))
    response['template'] = response['intent'].split('.')[0]
    let result = await userService.getIntentResult(response['intent'],String(socket.handshake.session.username))
    response['data'] = (result) ? result : null
    response['sessionID'] = socket.handshake.session.id
    // await userService.getSession(socket.handshake.session.username)
    response['timestamp'] = new Date()
    response['sessionStatus'] = true
    response['event'] = event
    response['from'] = botname
    response['to'] = String(socket.handshake.session.username)
    return response
    }
let getLogFormat = async(event,socket,sessionStatus) => {
    let log = {}
    log['sessionID'] = socket.handshake.session.id
    // await userService.getSession(socket.handshake.session.username)
    log['timestamp'] = new Date()
    log['sessionStatus'] = sessionStatus
    log['event'] = event
    if(event=='disconnect'){
        let lastEvent = await userService.getLastEvent(socket.handshake.session.username,log['sessionID'])
            console.log('last event',lastEvent)
        if(lastEvent['event']=='add user'&&lastEvent['sessionStatus']==true){
            log['droppedOff'] = true
        }
    }
    return log
}
module.exports = {
    getRequestFormat,
    getResponseFormat,
    getLogFormat
} 