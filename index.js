const express = require('express')
require('dotenv').config()
const cors = require('cors')
const helmet = require('helmet')
const path = require('path')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const MySQLStore = require('express-mysql-session')(session)
const {sanitize, applySecurity} = require('./middleware/sanitizeMiddleware')
const { globalLimiter } = require('./middleware/rateLimitMiddleware')
const errorMiddleware = require('./middleware/errorMiddleware')
const authRoutes = require('./routes/auth/auth')
const cmsRoutes = require('./routes/cms/cms')
const locationRoutes = require('./routes/location/location')
const galleryRoutes = require('./routes/gallery/gallery')
const faqRoutes = require('./routes/faq/faq')
const enquiryRoutes = require('./routes/enquiry/enquiry')
const homeRoutes = require('./routes/home/home')

require('./config/db')
const { pool } = require('./config/db')

const app = express()
const PORT = process.env.PORT || 3500

applySecurity(app)

const sessionStore = new MySQLStore({}, pool)

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 1000 * 60 * 60
    }
}))

app.use(helmet())
app.use(cors())
app.use(express.json({ limit: '1mb' }))
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.use(globalLimiter)

app.use(sanitize)

app.use('/uploaded_files', express.static(path.join(__dirname, 'poultry_farming')))

app.get('/', (req, res) => {
    res.send('Welcome to Plant Master Web Services Developed on Node.JS, Express.js, and MySQL !!!!')
})

app.get('/api', (req, res) => {
    res.send('Plant Master APIs')
})
app.use('/api/auth', authRoutes)
app.use('/api/cms', cmsRoutes)
app.use('/api/location', locationRoutes)
app.use('/api/gallery', galleryRoutes)
app.use('/api/faq', faqRoutes)
app.use('/api/enquiry', enquiryRoutes)
app.use('/api/home', homeRoutes)

app.use(errorMiddleware)

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running at http://0.0.0.0:${PORT}`)
})