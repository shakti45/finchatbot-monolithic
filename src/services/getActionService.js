const {mBot} = require('./processNLPService')
let getAction = async(message)=>{
    let result = await mBot(message)
    return result
}


module.exports =  {getAction}
