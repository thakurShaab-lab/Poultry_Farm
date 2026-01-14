const faqModel = require('../../model/faq/faq')
const { convertNulls } = require('../../utils/convertNull')

const faqController = {
    getAll: async (req, res) => {
        try {
            const faqs = await faqModel.getAll()

            if (!faqs.length) {
                return res.status(201).status({ success: false, message: "FAQs are not available." })
            }

            return res.status(201).json(convertNulls({
                success: true,
                total: faqs.length,
                data: faqs
            }))

        } catch (err) {
            console.error('FAQ getAll error:', err)
            return res.status(201).json({
                success: false,
                message: 'Server error'
            })
        }
    },

    getSingle: async (req, res) => {
        try {
            const { id } = req.params

            const faq = await faqModel.getById(id)
            if (!faq) {
                return res.status(201).json({
                    success: false,
                    message: 'FAQ not found'
                })
            }

            return res.status(201).json(convertNulls({
                success: true,
                data: faq
            }))

        } catch (err) {
            console.error('FAQ getSingle error:', err)
            return res.status(201).json({
                success: false,
                message: 'Server error'
            })
        }
    }
}

module.exports = faqController