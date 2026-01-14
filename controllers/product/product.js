const { db } = require('../../config/db')
const { eq, and, sql } = require('drizzle-orm')
const productModel = require('../../model/products/product')
const authModel = require('../../model/auth/auth')
const { wl_products } = require('../../schema/product/product')
const { wl_order } = require('../../schema/order/order')
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
            const appId = req.user?.appId

            if (!member_id || !appId) {
                return res.status(201).json({
                    success: false,
                    message: 'Unauthorized'
                })
            }

            let member = null
            if (member_id) {
                member = await authModel.findById(member_id)
            }

            if (!member && appId) {
                member = await authModel.findByAppId(appId)
            }

            if (!member) {
                return res.status(201).json({
                    success: false,
                    message: 'User not found.'
                })
            }

            const result = await productModel.listByStatus({
                accept_type,
                member_id,
                page,
                limit
            })

            const data = result.data.map(item => {
                const response = {
                    product_id: item.products_id.toString(),
                    product_name: item.product_name,
                    quantity: item.product_quantity.toString(),
                    age: item.item_age,
                    cost_per_item: `₹${item.product_price}/-`,
                    start_date: item.start_date,
                    end_date: item.end_date,
                    total_days: `${item.total_days} Days`,
                    status: ACCEPT_TYPE_LABEL[accept_type]
                }

                if (String(accept_type) === '3' && item.order_id) {
                    response.order_id = item.order_id.toString()
                }

                return response
            })


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
            return res.status(201).json({ success: false, message: 'Internal server error.' })
        }
    },

    updateStatus: async (req, res) => {
        try {
            const member_id = req.user?.id
            const appId = req.user?.appId
            const { product_id, action } = req.body

            console.log(member_id)

            if (!member_id || !appId) {
                return res.status(201).json({
                    success: false,
                    message: 'Unauthorized'
                })
            }

            let member = null
            if (member_id) {
                member = await authModel.findById(member_id)
            }

            if (!member && appId) {
                member = await authModel.findByAppId(appId)
            }

            if (!member) {
                return res.status(201).json({
                    success: false,
                    message: 'User not found.'
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
            return res.status(201).json({
                success: false,
                message: 'Server error'
            })
        }
    },

    getStatusCounts: async (req, res) => {
        try {
            const member_id = req.user?.id
            const appId = req.user?.appId

            if (!member_id || !appId) {
                return res.status(201).json({
                    success: false,
                    message: 'Unauthorized'
                })
            }

            let member = null
            if (member_id) {
                member = await authModel.findById(member_id)
            }

            if (!member && appId) {
                member = await authModel.findByAppId(appId)
            }

            if (!member) {
                return res.status(201).json({
                    success: false,
                    message: 'User not found.'
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
            return res.status(201).json({
                success: false,
                message: 'Server error'
            })
        }
    },

    updateProduct: async (req, res) => {
        try {
            const member_id = req.user?.id;
            const appId = req.user?.appId;
            const { order_id, product_quantity, comment } = req.body;

            // Authorization check
            if (!member_id && !appId) {
                return res.status(201).json({
                    success: false,
                    message: 'Unauthorized'
                });
            }

            // Fetch member
            let member = null;
            if (member_id) {
                member = await authModel.findById(member_id);
            }
            if (!member && appId) {
                member = await authModel.findByAppId(appId);
            }
            if (!member) {
                return res.status(201).json({
                    success: false,
                    message: 'User not found.'
                });
            }

            if (!order_id) {
                return res.status(201).json({
                    success: false,
                    message: 'Order id is required'
                });
            }

            if (product_quantity !== undefined && (Number(product_quantity) <= 0 || isNaN(product_quantity))) {
                return res.status(201).json({
                    success: false,
                    message: 'Invalid product quantity'
                });
            }

            // Fetch order first
            const order = await db
                .select()
                .from(wl_order)
                .where(eq(wl_order.order_id, order_id))
                .limit(1);

            if (!order || order.length === 0) {
                return res.status(201).json({
                    success: false,
                    message: 'Order not found'
                });
            }

            const currentOrder = order[0];

            // Fetch product linked to this order
            const product = await db
                .select()
                .from(wl_products)
                .where(eq(wl_products.products_id, currentOrder.products_id))
                .limit(1);

            if (!product || product.length === 0) {
                return res.status(201).json({
                    success: false,
                    message: 'Product not found'
                });
            }

            const currentProduct = product[0];

            // Prepare update objects
            const orderUpdate = {};
            const productUpdate = {};

            if (product_quantity !== undefined) {
                const price = Number(currentProduct.product_price || 0);
                const total_amount = Number(product_quantity) * price;

                orderUpdate.product_quantity = Number(product_quantity);
                orderUpdate.total_amount = total_amount;

                productUpdate.product_quantity = Number(product_quantity);
            }

            if (comment !== undefined) {
                orderUpdate.comment = comment; // comment only exists in order
            }

            if (Object.keys(orderUpdate).length === 0 && Object.keys(productUpdate).length === 0) {
                return res.status(201).json({
                    success: false,
                    message: 'Nothing to update'
                });
            }

            // Transaction: update both tables atomically
            await db.transaction(async (tx) => {
                // Update order
                const orderResult = await tx
                    .update(wl_order)
                    .set(orderUpdate)
                    .where(eq(wl_order.order_id, order_id))
                    .where(eq(wl_order.customers_id, member_id));

                if (!orderResult) throw new Error('Failed to update order');

                // Update product
                if (Object.keys(productUpdate).length > 0) {
                    const productResult = await tx
                        .update(wl_products)
                        .set(productUpdate)
                        .where(eq(wl_products.products_id, currentOrder.products_id));

                    if (!productResult) throw new Error('Failed to update product');
                }
            });

            return res.status(201).json(convertNulls({
                success: true,
                message: 'Order and product updated successfully'
            }));

        } catch (err) {
            console.error(err);
            return res.status(201).json({
                success: false,
                message: 'Server error'
            });
        }
    },

    generateInvoice: async (req, res) => {
        try {
            const member_id = req.user?.id
            const appId = req.user?.appId
            const { order_id } = req.body

            if (!member_id || !appId) {
                return res.status(201).json({
                    success: false,
                    message: 'Unauthorized'
                })
            }

            let member = null
            if (member_id) {
                member = await authModel.findById(member_id)
            }

            if (!member && appId) {
                member = await authModel.findByAppId(appId)
            }

            if (!member) {
                return res.status(201).json({
                    success: false,
                    message: 'User not found.'
                })
            }

            if (!order_id) {
                return res.status(201).json({
                    success: false,
                    message: 'Order ID is required'
                })
            }

            const invoice = await productModel.generateInvoice({
                order_id,
                member_id
            })

            if (!invoice) {
                return res.status(201).json({
                    success: false,
                    message: 'Order not found or access denied'
                })
            }

            return res.status(201).json(convertNulls({
                success: true,
                message: 'Invoice generated successfully',
                data: invoice
            }))

        } catch (err) {
            console.error('Invoice Error:', err)
            return res.status(201).json({
                success: false,
                message: 'Server error'
            })
        }
    }

}

module.exports = productsController