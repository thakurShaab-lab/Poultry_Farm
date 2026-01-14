const { eq, and, sql } = require('drizzle-orm')
const { db } = require('../../config/db')
const { tbl_admin } = require('../../schema/admin/admin')
const { wl_customers } = require('../../schema/auth/index')
const { wl_products } = require('../../schema/product/product')
const { wl_order } = require('../../schema/order/order')

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
                total_days: sql`DATEDIFF(${wl_products.end_date}, ${wl_products.start_date})`,
                order_id: wl_order.order_id
            })
            .from(wl_products)
            .leftJoin(
                wl_order,
                and(
                    eq(wl_order.products_id, sql`CAST(${wl_products.products_id} AS CHAR)`),
                    eq(wl_order.customers_id, member_id)
                )
            )
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

    updateStatusAndCreateOrder: async ({ product_id, member_id, accept_type }) => {

        return await db.transaction(async (tx) => {

            const [member] = await tx.select().from(wl_customers).where(eq(wl_customers.customers_id, member_id))

            const product = await tx
                .select()
                .from(wl_products)
                .where(
                    and(
                        eq(wl_products.products_id, product_id),
                        eq(wl_products.member_id, member_id),
                        eq(wl_products.status, '1')
                    )
                )
                .limit(1)

            if (!product.length) return null

            const productData = product[0]

            const updateResult = await tx
                .update(wl_products)
                .set({
                    accept_type,
                    product_updated_date: new Date()
                })
                .where(eq(wl_products.products_id, product_id))

            if (updateResult.affectedRows === 0) return null

            if (accept_type === '3') {

                const orderPayload = {
                    customers_id: productData.member_id || 0,
                    customer_type: 'Member',

                    invoice_number: `INV-${Date.now()}`,
                    products_id: String(productData.products_id),
                    product_name: productData.product_name,

                    first_name: productData.first_name,
                    last_name: member.last_name ? member.last_name : null,
                    mobile_number: member.mobile_number,
                    email: member.user_name,

                    total_amount:
                        productData.product_price * productData.product_quantity,

                    product_price: productData.product_price,

                    vat_applied_cent: productData.vat_applied_cent || 0,
                    currency_code: 'INR',
                    currency_symbol: '₹',
                    currency_value: 1,

                    order_status: 'Pending',
                    order_received_date: new Date(),

                    payment_method: 'COD',
                    payment_status: 'Unpaid',

                    bill_number: `BILL-${Date.now()}`,
                    product_quantity: productData.product_quantity,

                    farm_name: productData.farm_name,
                    loction: productData.location
                }

                await tx.insert(wl_order).values(orderPayload)
            }

            return true
        })
    },

    updateProduct: async ({
        order_id,
        member_id,
        product_quantity,
        comment
    }) => {
        return await db.transaction(async (tx) => {

            const order = await tx
                .select()
                .from(wl_order)
                .where(
                    and(
                        eq(wl_order.order_id, order_id),
                        eq(wl_order.customers_id, member_id)
                    )
                )
                .limit(1)

            if (!order.length) return null

            const orderData = order[0]

            const newTotal =
                Number(orderData.product_price) * Number(product_quantity)

            await tx
                .update(wl_order)
                .set({
                    product_quantity,
                    total_amount: newTotal,
                    comment: comment || null
                })
                .where(
                    and(
                        eq(wl_order.order_id, order_id),
                        eq(wl_order.customers_id, member_id)
                    )
                )

            return true
        })
    },

    generateInvoice: async ({ order_id, member_id }) => {
        return await db.transaction(async (tx) => {

            const order = await tx
                .select()
                .from(wl_order)
                .where(
                    and(
                        eq(wl_order.order_id, order_id),
                        eq(wl_order.customers_id, member_id)
                    )
                )
                .limit(1)

            if (!order.length) return null
            const o = order[0]

            const admin = await tx
                .select()
                .from(tbl_admin)
                .where(eq(tbl_admin.status, '1'))
                .limit(1)

            const seller = admin[0] || {}

            const subTotal =
                Number(o.product_price || 0) * Number(o.product_quantity || 0)

            const invoiceId = o.invoice_number || `INV-${Date.now()}`

            if (!o.invoice_number) {
                await tx
                    .update(wl_order)
                    .set({ invoice_number: invoiceId })
                    .where(eq(wl_order.order_id, order_id))
            }

            return {
                invoice_info: {
                    invoice_id: invoiceId,
                    invoice_date: new Date(o.order_received_date).toLocaleDateString(
                        'en-IN',
                        { day: '2-digit', month: 'short', year: 'numeric' }
                    ),
                    order_id: o.order_id,
                    payment_method: o.payment_method,
                    payment_status: o.payment_status,
                    total_payable_amount: subTotal
                },

                seller_details: {
                    name: seller.admin_name || "",
                    email: seller.admin_email || "",
                    mobile: seller.mobile || seller.phone || "",
                    address: {
                        address_line: seller.address || "",
                        city: seller.city || "",
                        state: seller.state || "",
                        country: seller.country || "",
                        zipcode: seller.zipcode || ""
                    },
                    vat_percentage: seller.vat || 0
                },

                buyer_details: {
                    name: `${o.first_name} ${o.last_name || ""}`.trim(),
                    email: o.email,
                    mobile: o.mobile_number || o.phone || "",
                    address: {
                        billing_name: o.billing_name || "",
                        billing_address: o.billing_address || "",
                        city: o.billing_city || "",
                        state: o.billing_state || "",
                        country: o.billing_country || "",
                        zipcode: o.billing_zipcode || ""
                    }
                },

                product_details: {
                    product_name: o.product_name,
                    farm_name: o.farm_name || "",
                    quantity: o.product_quantity,
                    price: o.product_price
                },

                amount_summary: {
                    sub_total: subTotal,
                    vat_percentage: o.vat_applied_cent,
                    total_amount: subTotal
                },

                currency: {
                    symbol: o.currency_symbol,
                    code: o.currency_code
                }
            }
        })
    }

}


module.exports = productModel