const express = require('express')
const app = express()
const rootRoute = require('../../routes')
const errorHandler = require('../../middleware/errorHandler')

var path = require('path')
app.use(express.static(path.join(__dirname, '/../../public')))

app.use('/api',rootRoute)
app.use(errorHandler)


module.exports = app