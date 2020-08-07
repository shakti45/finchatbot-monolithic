const queries = require("../queries")

let getUsersStats = async() => {
    try{
        // let totalUsers = await queries.getTotalUsers()
        // console.log(totalUsers)
        let totalDroppedOffSessions = await queries.getDroppedOffSessions()
        // console.log(totalDroppedOffSessions)
        let interactiveUsers = await queries.getInteractiveUsers()
        // console.log(interactiveUsers)
        let sum = 0
        let result = {}
        for(let i in totalDroppedOffSessions){
            sum=sum+totalDroppedOffSessions[i]['count']

        }
        result['totalDroppedOffSessionsPerUser'] ={}
        result['totalDroppedOffSessionsPerUser']= totalDroppedOffSessions
        result['totalDroppedOffSessions'] = sum
        sum = 0
        for(let i in interactiveUsers){
            sum = sum+interactiveUsers[i]['count']
        }
        result['interactiveSessionPerUser'] = {}
        result['interactiveSessionPerUser'] = interactiveUsers
        result['totalInteractiveSessions'] = sum
        result['totalSessions'] = result['totalInteractiveSessions']+result['totalDroppedOffSessions']
        console.log(result)
        return result
    } catch(ex){
        console.log(ex)
        throw new Exception(ex)
    }
}

module.exports = {
    getUsersStats
}