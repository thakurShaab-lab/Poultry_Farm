const jwt = require('jsonwebtoken')
const { and, eq, sql } = require('drizzle-orm')
const { db } = require('../config/db')
const { wl_customers } = require('../schema/auth/index')
// const { tbl_admin } = require('../models/admin/index')

const JWT_SECRET = process.env.ACCESS_SECRET

const authMiddleware = async (req, res, next) => {
    try {
        let token

        if (req.headers.authorization?.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1]
        } else if (req.cookies?.token) {
            token = req.cookies.token
        }

        if (!token) {
            req.user = null
            return next()
        }

        const decoded = jwt.verify(token, JWT_SECRET)

        const [user] = await db
            .select()
            .from(wl_customers)
            .where(eq(wl_customers.customers_id, decoded.id))

        if (!user) {
            req.user = null
            return next()
        }

        req.user = {
            id: user.customers_id,
            user_name: user.user_name,
            mobile_number: user.mobile_number,
            // customer_name: user.first_name + " " + user.last_name,
            customer_name: user.first_name,
            customer_photo: user.customer_photo,
            user_type: user.user_type,
            language: user.language_id,
            member_nature: user.member_nature
        }

        next()
    } catch (err) {
        console.error("Auth error:", err)

        req.user = null

        if (err.name === "TokenExpiredError") {
            console.log("Middleware sending response:", err.name, "status:", err.name === "TokenExpiredError" ? 201 : 201)
            return res.status(201).json({
                success: false,
                message: "Session expired, please login again"
            })
        }

        return res.status(201).json({
            success: false,
            message: "Invalid token"
        })
    }
}

// const adminAuth = async (req, res, next) => {
//     try {
//         let token

//         if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
//             token = req.headers.authorization.split(' ')[1]
//         }

//         else if (req.cookies && req.cookies.token) {
//             token = req.cookies.token
//         }

//         if (!token) {
//             return res.status(201).json({
//                 success: false,
//                 message: 'Access denied. Please login.',
//             })
//         }

//         let decoded
//         try {
//             decoded = jwt.verify(token, JWT_SECRET)
//         } catch (err) {
//             return res.status(201).json({
//                 success: false,
//                 message: 'Invalid or expired token. Please login again',
//             })
//         }

//         const [admin] = await db
//             .select()
//             .from(tbl_admin)
//             .where(eq(tbl_admin.admin_id, decoded.id))

//         if (!admin) {
//             return res.status(201).json({ success: false, message: 'Admin not found.' })
//         }

//         if (admin.status !== '1') {
//             return res.status(201).json({
//                 success: false,
//                 message: 'Admin account is inactive or blocked.',
//             })
//         }

//         req.admin = {
//             id: admin.admin_id,
//             username: admin.admin_username,
//             email: admin.admin_email,
//             type: admin.admin_type,
//         }

//         next()
//     } catch (error) {
//         console.error('❌ Admin Auth Error:', error)
//         return res.status(500).json({
//             success: false,
//             message: 'Server error while authenticating admin.',
//         })
//     }
// }

module.exports = { authMiddleware }