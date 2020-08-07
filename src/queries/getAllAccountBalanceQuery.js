const {database_url,database} = require('../vars')


const MongoClient = require('mongodb').MongoClient

const url = database_url

let getAllAccountBalanceQuery = async(userid)=> {

    const client = await MongoClient.connect(url, { useNewUrlParser: true })
        .catch(err => { console.log(err) })

    if (!client) {
        return
    }

    try {
        // //console.log('act',actType)
        //console.log(userid)
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
                    'accounts.type': {
                        $in: ['savings','current','creditCard']
                    }
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
module.exports = getAllAccountBalanceQuery