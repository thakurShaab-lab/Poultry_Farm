const productModel = require('../../model/products/product')
const { convertNulls } = require('../../utils/convertNull')

const ACCEPT_TYPE_LABEL = {
    '0': 'New Order',
    '1': 'In-Process',
    '2': 'Rejected',
    '3': 'Completed'
}

const productsController = {

    listByStatus: async (req, res) => {
        try {
            const { accept_type } = req.query
            const page = Number(req.query.page || 1)
            const limit = Number(req.query.limit || 10)
            const member_id = req.user?.id

            if (!member_id) {
                return res.status(201).json({ success: false, message: 'Please login first.' })
            }

            const result = await productModel.listByStatus({
                accept_type,
                member_id,
                page,
                limit
            })

            const data = result.data.map(item => ({
                product_id: item.products_id.toString(),
                product_name: item.product_name,
                quantity: item.product_quantity.toString(),
                age: item.item_age,
                cost_per_item: `₹${item.product_price}/-`,
                start_date: item.start_date,
                end_date: item.end_date,
                total_days: `${item.total_days} Days`,
                status: ACCEPT_TYPE_LABEL[accept_type]
            }))

            return res.status(201).json(convertNulls({
                success: true,
                page,
                limit,
                total: result.total,
                status_type: ACCEPT_TYPE_LABEL[accept_type],
                data
            }))

        } catch (err) {
            console.error(err)
            return res.status(500).json({ success: false, message: 'Internal server error.' })
        }
    },

    updateStatus: async (req, res) => {
        try {
            const member_id = req.user?.id
            const { product_id, action } = req.body

            console.log(member_id)

            if (!member_id) {
                return res.status(201).json({
                    success: false,
                    message: 'Unauthorized'
                })
            }

            const ACTION_MAP = {
                accept: '1',
                reject: '2',
                complete: '3'
            }

            const accept_type = ACTION_MAP[action]

            if (!accept_type) {
                return res.status(201).json({
                    success: false,
                    message: 'Invalid action'
                })
            }

            const result = await productModel.updateStatusAndCreateOrder({
                product_id,
                member_id,
                accept_type
            })

            console.log(member_id)

            if (!result) {
                return res.status(201).json({
                    success: false,
                    message: 'Product not found or access denied'
                })
            }

            return res.status(201).json({
                success: true,
                message:
                    accept_type === '3'
                        ? 'Product completed and order created successfully'
                        : `Product ${action}ed successfully`
            })

        } catch (err) {
            console.error(err)
            return res.status(500).json({
                success: false,
                message: 'Server error'
            })
        }
    },

    getStatusCounts: async (req, res) => {
        try {
            const member_id = req.user?.id

            if (!member_id) {
                return res.status(401).json({
                    success: false,
                    message: 'Unauthorized'
                })
            }

            const counts = await productModel.getStatusCounts(member_id)

            return res.json({
                success: true,
                counts: {
                    new: Number(counts.new_count),
                    in_process: Number(counts.in_process_count),
                    rejected: Number(counts.rejected_count),
                    completed: Number(counts.completed_count)
                }
            })

        } catch (err) {
            console.error(err)
            return res.status(500).json({
                success: false,
                message: 'Server error'
            })
        }
    },

    updateProduct: async (req, res) => {
        try {
            const member_id = req.user?.id
            const { order_id, product_quantity, comment } = req.body

            if (!member_id) {
                return res.status(201).json({
                    success: false,
                    message: 'Unauthorized'
                })
            }

            if (!order_id || !product_quantity || product_quantity <= 0) {
                return res.status(201).json({
                    success: false,
                    message: 'Invalid order id or quantity'
                })
            }

            console.log('Req.Body:', req.body)
            console.log('Member ID:', member_id)

            const result = await productModel.updateProduct({
                order_id,
                member_id,
                product_quantity,
                comment
            })

            console.log('Result:', result)

            if (!result) {
                return res.status(201).json({
                    success: false,
                    message: 'Order not found or access denied'
                })
            }

            return res.status(201).json(convertNulls({
                success: true,
                message: 'Order updated successfully'
            }))

        } catch (err) {
            console.error(err)
            return res.status(500).json({
                success: false,
                message: 'Server error'
            })
        }
    },

    generateInvoice: async (req, res) => {
        try {
            const member_id = req.user?.id
            const { order_id } = req.body

            if (!member_id) {
                return res.status(401).json({
                    success: false,
                    message: 'Unauthorized'
                })
            }

            if (!order_id) {
                return res.status(400).json({
                    success: false,
                    message: 'Order ID is required'
                })
            }

            const invoice = await productModel.generateInvoice({
                order_id,
                member_id
            })

            if (!invoice) {
                return res.status(404).json({
                    success: false,
                    message: 'Order not found or access denied'
                })
            }

            return res.status(200).json(convertNulls({
                success: true,
                message: 'Invoice generated successfully',
                data: invoice
            }))

        } catch (err) {
            console.error('Invoice Error:', err)
            return res.status(500).json({
                success: false,
                message: 'Server error'
            })
        }
    }

}

module.exports = productsController