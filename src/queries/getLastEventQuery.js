const {database_url,database} = require('../vars')
// const logger = require('../middleware/logger/logger')


const MongoClient = require('mongodb').MongoClient

const url = database_url

let getLastEventQuery = async(userid,sessionID)=> {

    const client = await MongoClient.connect(url, { useNewUrlParser: true })
        .catch(err => { console.log(err) })

    if (!client) {
        return
    }

    try {
        const db = client.db(database)

        let collection = db.collection('conversations')
        let res = await collection.aggregate([
            {
                $unwind: '$conversations'
            },
            {
                $match : {
                    'userid':userid,
                    'conversations.sessionID':sessionID
                }
            },
            {
                $sort:{
                    'conversations.timestamp':-1
                    }
            },
            {
                $limit: 1
            },
            {
                $project: {
                    '_id':0,
                    'sessionStatus': '$conversations.sessionStatus',
                    'event' : '$conversations.event'
                    }
            }
        ]).toArray()
        return res[0]

    } catch (err) {

        throw new Error(err)
    } finally {

        client.close()
    }
}
module.exports = getLastEventQuery