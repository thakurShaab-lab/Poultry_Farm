const rateLimit = require('express-rate-limit')

const globalLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    statusCode: 429,
    message: {
        success: false,
        message: 'Too many requests. Please slow down.'
    }
})

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    statusCode: 429,
    message: {
        success: false,
        message: 'Too many login/register attempts. Try again later.'
    }
})

module.exports = { globalLimiter, authLimiter }
