const jwt = require('jsonwebtoken')
const { and, eq, sql } = require('drizzle-orm')
const { db } = require('../config/db')
const { wl_customers } = require('../schema/auth/index')
// const { tbl_admin } = require('../models/admin/index')

const JWT_SECRET = process.env.ACCESS_SECRET

const authMiddleware = async (req, res, next) => {
    try {
        let token
        const appId = req.headers['x-app-id']

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
            appId: appId,
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

module.exports = { authMiddleware }