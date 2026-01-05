const express = require('express')
const locationController = require('../../controllers/location/location')

const router = express.Router()

router.get('/list', locationController.getLocations)
router.get('/get/:id', locationController.getLocationById)

module.exports = router
