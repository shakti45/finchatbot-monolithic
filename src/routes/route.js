const express = require('express')
const adminRoute = express.Router()
const adminController = require('../controller')

adminRoute.get('/getUserStats',adminController.getSessionStats)

module.exports =  adminRoute
