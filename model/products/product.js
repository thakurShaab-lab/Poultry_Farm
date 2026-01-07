const { eq, and, sql } = require('drizzle-orm')
const { db } = require('../../config/db')
const { wl_products } = require('../../schema/product/product')

const productModel = {

    listByStatus: async ({ accept_type, member_id, page, limit }) => {
        const offset = (page - 1) * limit

        const conditions = [
            eq(wl_products.accept_type, String(accept_type)),
            eq(wl_products.member_id, member_id),
            eq(wl_products.status, '1')
        ]

        const data = await db
            .select({
                products_id: wl_products.products_id,
                product_name: wl_products.product_name,
                product_quantity: wl_products.product_quantity,
                item_age: wl_products.item_age,
                product_price: wl_products.product_price,
                start_date: wl_products.start_date,
                end_date: wl_products.end_date,
                total_days: sql`DATEDIFF(${wl_products.end_date}, ${wl_products.start_date})`
            })
            .from(wl_products)
            .where(and(...conditions))
            .limit(limit)
            .offset(offset)

        const total = await db
            .select({ count: sql`COUNT(*)` })
            .from(wl_products)
            .where(and(...conditions))

        return {
            data,
            total: total[0].count
        }
    },

    getStatusCounts: async (member_id) => {
        const result = await db.execute(sql`
            SELECT 
                SUM(accept_type = '0') AS new_count,
                SUM(accept_type = '1') AS in_process_count,
                SUM(accept_type = '2') AS rejected_count,
                SUM(accept_type = '3') AS completed_count
            FROM wl_products
            WHERE member_id = ${member_id}
            AND status = '1'
        `)

        return result[0]
    },

    updateStatusAndCreateOrder: async ({
        product_id,
        member_id,
        accept_type,
        quantity,
        customerData
    }) => {

        const result = await db
            .update(wl_products)
            .set({
                accept_type,
                product_updated_date: new Date()
            })
            .where(
                and(
                    eq(wl_products.products_id, product_id),
                    eq(wl_products.member_id, member_id)
                )
            )

        if (result.affectedRows === 0) return null

        if (accept_type === '3') {

            const orderPayload = {
                customers_id: customerData.customers_id || 0,
                customer_type: 'Member',

                invoice_number: `INV-${Date.now()}`,
                products_id: String(product_id),
                product_name: customerData.product_name || null,

                first_name: customerData.first_name,
                last_name: customerData.last_name || null,
                mobile_number: customerData.mobile_number || null,
                email: customerData.email,

                total_amount: customerData.total_amount,
                product_price: customerData.product_price,

                vat_applied_cent: customerData.vat_applied_cent || 0,
                currency_code: customerData.currency_code || 'INR',
                currency_symbol: customerData.currency_symbol || '₹',
                currency_value: 1,

                order_status: 'Pending',
                order_received_date: new Date(),

                payment_method: customerData.payment_method || 'COD',
                payment_status: 'Unpaid',

                bill_number: `BILL-${Date.now()}`,
                product_quantity: quantity,

                farm_name: customerData.farm_name || null,
                loction: customerData.location || null,
            }

            await orderModel.createOrder(orderPayload)
        }

        return true
    }

}

module.exports = productModel