
const {database_url,database} = require('../vars')
// const logger = require('../middleware/logger/logger')


const MongoClient = require('mongodb').MongoClient

const url = database_url

let getTotalUsers = async()=> {

    const client = await MongoClient.connect(url, { useNewUrlParser: true })
        .catch(err => { console.err(err) })

    if (!client) {
        return
    }

    try {
        const db = client.db(database)

        let collection = db.collection('conversations')
        let res = await collection.find({}).count()
        console.log('totalUsers', res)
        return res

    } catch (err) {

        throw new Error(err)
    } finally {

        client.close()
    }
}
module.exports = getTotalUsers