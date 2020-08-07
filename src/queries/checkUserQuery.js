const {database_url,database} = require('../vars')
// const logger = require('../middleware/logger/logger')


const MongoClient = require('mongodb').MongoClient

const url = database_url

let checkUserQuery = async(userid)=> {
    const client = await MongoClient.connect(url, { useNewUrlParser: true })
        .catch(err => { console.err(err) })

    if (!client) {
        return
    }

    try {
        //console.log(userid)
        const db = client.db(database)
        let collection = db.collection('users')
        let res = await collection.find({
            'userid' : userid,
            'removed' : false            
        }).toArray()
        //console.log(res)
        if(res[0]){
            return true
        } else {
            return false
        }
    } catch (err) {
        throw new Error(err)
    } finally {
        client.close()
    }
}
module.exports = checkUserQuery