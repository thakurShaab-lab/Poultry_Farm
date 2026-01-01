const express = require('express')
const dotenv = require('dotenv').config()
const cors = require('cors')
const helmet = require('helmet')
const path = require('path')
const crypto = require('crypto')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const MySQLStore = require('express-mysql-session')(session)
const applySecurity = require('./middleware/sanitizeMiddleware')
const { globalLimiter } = require('./middleware/rateLimitMiddleware')
const errorMiddleware = require('./middleware/errorMiddleware')
require('./config/db')
const { pool } = require('./config/db')

const app = express()
const PORT = process.env.PORT || 3000

const sessionStore = new MySQLStore({}, pool)

app.use(session({
    secret: process.env.SESSION_SECRET || 'supersecretkey',
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
        httpOnly: true,
        secure: false,
        maxAge: 1000 * 60 * 60
    }
}))
app.use(cors())
app.use(helmet())

app.get('/', (req, res) => {
    res.send('Welcome to Plant Master Web Services Developed on Node.JS, Express.js, and MySQL !!!!')
})
app.get('/api', (req, res) => {
    res.send('Plant Master APIs')
})

app.use(express.json({ limit: '1mb' }))
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(globalLimiter)

app.use('/uploaded_files', express.static(path.join(__dirname, "plant")))

applySecurity(app)

app.use(errorMiddleware)


app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running at http://0.0.0.0:${PORT}`)
})