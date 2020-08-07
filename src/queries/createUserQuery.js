const {database_url,database} = require('../vars')
// const logger = require('../middleware/logger/logger')


const MongoClient = require('mongodb').MongoClient

const url = database_url

let createUserQuery = async(userid)=> {

    const client = await MongoClient.connect(url, { useNewUrlParser: true })
        .catch(err => { throw new Error(err) })

    if (!client) {
        return
    }

    try {
        //console.log(userid)
        const db = client.db(database)
        let collection = db.collection('users')
        let res = await collection.insert({
            'email' : userid,
            'userid' : userid,
            'password' : 'ssss',
            'removed' : false,
            'accounts' : [ 
                {
                    'type' : 'savings',
                    'active' : true,
                    'accountNumber' : Math.floor(100000 + Math.random() * 900000),
                    'balance' : 5000
                }, 
                {
                    'type' : 'current',
                    'active' : true,
                    'accountNumber' : Math.floor(100000 + Math.random() * 900000),
                    'balance' : 5000
                }, 
                {
                    'type' : 'creditCard',
                    'active' : true,
                    'accountNumber' : Math.floor(100000 + Math.random() * 900000),
                    'balance' : 5000
                }
            ]
        })
        return res

    } catch (err) {

        throw new Error(err)
    } finally {

        client.close()
    }
}
module.exports = createUserQuery