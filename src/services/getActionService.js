const {mBot} = require('../config/processNLP')
let getAction = async(message)=>{
    let result = await mBot(message)
    return result
}


module.exports =  {getAction}
