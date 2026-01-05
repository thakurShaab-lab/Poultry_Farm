const validator = require("validator")
const contactUsModel = require('../../model/enquiry/enquiry')
const { convertNulls } = require('../../utils/convertNull')

const contactUsController = {

    submit: async (req, res) => {
        try {
            const {
                first_name,
                last_name,
                email,
                phone_number,
                comment,
            } = req.body

            if (!first_name || !last_name || !email || !phone_number || !comment) {
                return res.status(201).json({
                    success: false,
                    message: 'All fields are required'
                })
            }

            if (!email || !validator.isEmail(email)) {
                return res.status(201).json({
                    success: false,
                    message: "Invalid email format"
                })
            }

            const insertData = {
                type: '1',
                first_name,
                last_name,
                email,
                mobile_number: phone_number,
                message: comment,
                status: '1',
                reply_status: 'N',
                receive_date: new Date(),
                customers_id: 0,
                product_id: 0,
            }

            await contactUsModel.create(insertData)

            return res.status(201).json(convertNulls({
                success: true,
                message: 'Thank you for contacting us. We will get back to you soon.',
                email
            }))

        } catch (error) {
            console.error(error)
            return res.status(500).json({
                success: false,
                message: 'Server error'
            })
        }
    }
}

module.exports = contactUsController