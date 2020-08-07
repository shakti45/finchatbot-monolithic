const queries = require("../queries")

let getUsersStats = async() => {
    try{
        let totalUsers = await queries.getTotalUsers()
        // console.log(totalUsers)
        let totalDroppeOffSessions = await queries.getDroppedOffSessions()
        console.log(totalDroppeOffSessions)
        let interactiveUsers = await queries.getInteractiveUsers()
        console.log(interactiveUsers)
        let sum = 0
        let result = {}
        result['totalUsers'] = totalUsers
        result['droppedOffSessions']={}
        for(let i in totalDroppeOffSessions){
            result['droppedOffSessions'][totalDroppeOffSessions[i]['_id']]=totalDroppeOffSessions[i]['count']
            sum = sum+totalDroppeOffSessions[i]['count']
        }
        result['droppedOffSessions']['total'] = sum
        sum = 0
        result['interactiveSessions'] = {}
        for(let i in interactiveUsers){
            result['interactiveSessions'][interactiveUsers[i]['_id']]= interactiveUsers[i]['count']
            sum = sum+interactiveUsers[i]['count']
        }
        result['interactiveSessions']['total'] = sum
        console.log('result',result)
        return result
    } catch(ex){
        throw new Exception(ex)
    }
}

module.exports = {
    getUsersStats
}