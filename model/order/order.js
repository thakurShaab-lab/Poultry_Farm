const { db } = require('../../config/db')
const wl_order = require('../../schema/order/order')

const orderModel = {

    createOrder: async (orderData) => {
        const result = await db.insert(wl_order).values(orderData)
        return result.insertId
    },

}

module.exports = {orderModel}