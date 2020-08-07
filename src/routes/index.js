const express = require('express')
const rootRoute = express()
const adminRoute = require('./route')

rootRoute.use('/admin',adminRoute)

module.exports = rootRoute