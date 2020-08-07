let {adminService} = require('../services')
let getSessionStats = async(req,res,next) => {
    try{
        let stats  = await adminService.getUsersStats()
        // console.log('stats',stats)
        res.send({status:200,data:stats})
    } catch (ex) {
        next(ex)
    }
}

module.exports = {getSessionStats}