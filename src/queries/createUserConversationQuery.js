const {database_url,database} = require('../vars')
// const logger = require('../middleware/logger/logger')


const MongoClient = require('mongodb').MongoClient

const url = database_url

let createUserConversationQuery = async(userid)=> {

    const client = await MongoClient.connect(url, { useNewUrlParser: true })
        .catch(err => { throw new Error(err) })

    if (!client) {
        return
    }

    try {
        const db = client.db(database)
        let collection = db.collection('conversations')
        let res = await collection.insert({
            'userid' : userid,
            'counter' : 0,
            'conversations' : []
        })
        return res

    } catch (err) {

        throw new Error(err)
    } finally {

        client.close()
    }
}
module.exports = createUserConversationQuery