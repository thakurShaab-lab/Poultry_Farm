const helmet = require('helmet')
const express = require('express')
const xss = require('xss')

const app = express()

function applySecurity(app) {
    app.use(helmet({
        contentSecurityPolicy: false,
    }))

    app.use(express.json({ limit: '10kb' }))
    app.use(express.urlencoded({ extended: true, limit: '10kb' }))
}

const sanitizeObject = (obj) => {
    for (const key in obj) {
        if (typeof obj[key] === 'string') {
            obj[key] = xss(obj[key])
        } else if (typeof obj[key] === 'object' && obj[key] !== null) {
            sanitizeObject(obj[key])
        }
    }
}

const sanitize = (req, res, next) => {
    if (req.body) sanitizeObject(req.body)
    if (req.query) sanitizeObject(req.query)
    if (req.params) sanitizeObject(req.params)
    next()
}

module.exports = { applySecurity, sanitize }