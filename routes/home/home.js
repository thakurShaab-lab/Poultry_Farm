// routes/home.js
const express = require('express')
const router = express.Router()
const homeController = require('../../controllers/home/home')

router.get('/home', homeController.getHomeData)

module.exports = router