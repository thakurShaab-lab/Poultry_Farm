const express = require('express')
const router = express.Router()
const galleryController = require('../../controllers/gallery/gallery')

router.get('/list', galleryController.list)
router.get('/get/:id', galleryController.getSingle)

module.exports = router
