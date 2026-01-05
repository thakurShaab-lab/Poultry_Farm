const { db } = require('../../config/db')
const { wl_customers } = require('../../schema/auth/index')
const { eq } = require('drizzle-orm')

const authModel = {

    findByUsername: async (user_name) => {
        const result = await db
            .select()
            .from(wl_customers)
            .where(eq(wl_customers.user_name, user_name))
            .limit(1)

        return result[0] || null
    },

    findByMobile: async (mobile_number) => {
        const result = await db
            .select()
            .from(wl_customers)
            .where(eq(wl_customers.mobile_number, mobile_number))
            .limit(1)
        return result[0] || null
    },

    findById: async (customers_id) => {
        const result = await db
            .select()
            .from(wl_customers)
            .where(eq(wl_customers.customers_id, customers_id))
            .limit(1)

        return result[0] || null
    },

    create: async (data) => {
        return await db.insert(wl_customers).values(data)
    },

    update: async (customers_id, data) => {
        return await db
            .update(wl_customers)
            .set(data)
            .where(eq(wl_customers.customers_id, customers_id))
    },

    delete: async (customers_id) => {
        return await db
            .update(wl_customers)
            .set({ status: '2' })
            .where(eq(wl_customers.customers_id, customers_id))
    },

    hardDelete: async (customers_id) => {
        return await db
            .delete(wl_customers)
            .where(eq(wl_customers.customers_id, customers_id))
    },

    updateResetToken: async (userId, token) => {
        return await db
            .update(wl_customers)
            .set({ actkey: token })
            .where(eq(wl_customers.customers_id, userId))
    },

    updatePassword: async (userId, hashedPassword) => {
        return await db
            .update(wl_customers)
            .set({ password: hashedPassword })
            .where(eq(wl_customers.customers_id, userId))
    }
}

module.exports = authModel