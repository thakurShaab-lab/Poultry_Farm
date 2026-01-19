const { db } = require('../../config/db')
const { eq, sql } = require('drizzle-orm')
const { wl_cms_pages } = require('../../schema/cms/cms')

const pageModel = {
    getAll: async () => {
        return await db
            .select()
            .from(wl_cms_pages)
            .where(eq(wl_cms_pages.status, '1'))
            .orderBy(wl_cms_pages.page_name)
    },

    getById: async (pageId) => {
        const result = await db
            .select()
            .from(wl_cms_pages)
            .where(eq(wl_cms_pages.page_id, pageId))
            .limit(1)

        return result[0] || null
    },

    getByTitle: async (title) => {
        const result = await db
            .select()
            .from(wl_cms_pages)
            .where(eq(wl_cms_pages.page_name, title))
            .limit(1)

        return result[0] || null
    },

    getHomeStats: async () => {

        /* ===== COMPLETED PRODUCTS ===== */
        const [completedResult] = await db.execute(sql`
            SELECT COUNT(*) AS total
            FROM wl_products
            WHERE accept_type = '3'
        `)

        /* ===== TOTAL PRODUCTS ===== */
        const [totalProductsResult] = await db.execute(sql`
            SELECT COUNT(*) AS total
            FROM wl_products
            WHERE status = '1'
        `)

        /* ===== SATISFIED CUSTOMERS =====
           (verified + active + not blocked)
        */
        const [customersResult] = await db.execute(sql`
            SELECT COUNT(*) AS total
            FROM wl_customers
            WHERE status = '1'
              AND is_verified = '1'
              AND is_blocked = '0'
        `)

        const completed = completedResult[0]?.total || 0
        const totalProducts = totalProductsResult[0]?.total || 0
        const satisfiedCustomers = customersResult[0]?.total || 0

        const successRate =
            totalProducts > 0
                ? Math.round((completed / totalProducts) * 100)
                : 0

        return {
            completed,
            satisfied_customers: satisfiedCustomers,
            success_rate: successRate
        }
    }
}

module.exports = { pageModel }
