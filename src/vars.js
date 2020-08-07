
const dotenv  = require('dotenv').config()

let port = process.env.PORT
let database_url = process.env.DB_URL
let database = process.env.DB
let botname = process.env.BOT

module.exports = { 
    port,
    database_url,
    database,
    botname
}