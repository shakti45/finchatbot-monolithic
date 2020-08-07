const {database_url,database} = require('../vars')
// const logger = require('../middleware/logger/logger')


const MongoClient = require('mongodb').MongoClient

const url = database_url

let getAccountBalanceQuery = async(userid,actType)=> {

    const client = await MongoClient.connect(url, { useNewUrlParser: true })
        .catch(err => { console.log(err) })

    if (!client) {
        return
    }

    try {
        const db = client.db(database)

        let collection = db.collection('users')
        let res = await collection.aggregate([
            {
                $unwind:'$accounts'
            },
            {
                $match: {
                    'userid' : userid,
                    'accounts.active': true,
                    'accounts.type': actType
                }
            },
            {
                $project : {
                    'balance':'$accounts.balance',
                    'type': '$accounts.type',
                    'number': '$accounts.number'
                }
            }
        ]).toArray()
        return res

    } catch (err) {

        throw new Error(err)
    } finally {

        client.close()
    }
}
module.exports = getAccountBalanceQuery