const express = require('express')
const productsController = require('../../controllers/product/product')
const { authMiddleware } = require('../../middleware/authMiddleware')

const router = express.Router()

router.get('/list/by-status', authMiddleware, productsController.listByStatus)
router.put('/update-status', authMiddleware, productsController.updateStatus)
router.put('/update-product', authMiddleware, productsController.updateProduct)
router.get('/status-counts', authMiddleware, productsController.getStatusCounts)
router.get('/order/invoice', authMiddleware, productsController.generateInvoice)

module.exports = router
