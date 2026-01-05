const express = require('express')
const router = express.Router()
const contactUsController = require('../../controllers/enquiry/enquiry')
const contactController = require('../../controllers/enquiry/contact')

router.post('/contact-us', contactUsController.submit)
router.get('/contact', contactController.getContactUsData)

module.exports = router
