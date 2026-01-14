const express = require('express')
const { body } = require('express-validator')
const { authMiddleware } = require('../../middleware/authMiddleware')
const validateRequest = require('../../middleware/validateRequest')
const { authController, registerValidation, loginValidation } = require('../../controllers/auth/auth')
const { upload } = require('../../utils/upload')

const router = express.Router()

router.post('/register', (req, res, next) => {
    upload('customer_images').single('customer_photo')(req, res, (err) => {
        if (err) {
            return res.status(201).json({
                success: false,
                message: err.message
            })
        }
        next()
    })
}, registerValidation, validateRequest, authController.register)
router.post('/login', loginValidation, validateRequest, authController.login)
router.get('/profile', authMiddleware, authController.getUser)
router.post('/logout', authController.logout)
router.put("/update", authMiddleware, upload('customer_images').single('customer_photo'), authController.updateUser)
router.put("/delete", authMiddleware, authController.deleteUser)
router.put('/forgot-password', authController.forgotPassword)
router.put('/reset-password', authController.resetPasswordByEmail)
router.put('/change-password', authMiddleware, authController.resetPasswordFromProfile)

module.exports = router