const express = require('express')
const { pageController } = require('../../controllers/cms/cms')

const router = express.Router()

router.get('/list', pageController.getAllPages)
router.get('/get/:id', pageController.getPageById)
router.post('/title', pageController.getPageByTitle)

module.exports = router
