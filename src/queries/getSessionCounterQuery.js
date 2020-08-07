const {database_url,database} = require('../vars')
// const logger = require('../middleware/logger/logger')


const MongoClient = require('mongodb').MongoClient

const url = database_url

let getSessionCounterQuery = async(userid)=> {
    const client = await MongoClient.connect(url, { useNewUrlParser: true })
        .catch(err => { console.err(err) })

    if (!client) {
        return
    }

    try {
        const db = client.db(database)
        let collection = db.collection('conversations')
        let res = await collection.findOne({
            'userid' : userid            
        },{
            'counter': 1
        })
        return res['counter']
    } catch (err) {
        throw new Error(err)
    } finally {
        client.close()
    }
}
module.exports = getSessionCounterQuery