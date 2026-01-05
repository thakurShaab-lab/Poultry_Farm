const express = require('express')
const faqController = require('../../controllers/faq/faq')

const router = express.Router()

router.get('/list', faqController.getAll)
router.get('/get/:id', faqController.getSingle)

module.exports = router
