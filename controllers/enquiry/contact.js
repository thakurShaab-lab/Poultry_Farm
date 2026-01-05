const contactModel = require('../../model/enquiry/contact')
const { convertNulls } = require('../../utils/convertNull')

const contactController = {

    getContactUsData: async (req, res) => {
        try {
            const data = await contactModel.getContactData()

            if (!data) {
                return res.status(404).json({
                    success: false,
                    message: 'Contact details not found'
                })
            }

            return res.json(convertNulls({
                success: true,
                data: {
                    phone: data.phone || data.mobile,
                    email: data.email || data.contact_email,

                    address: [
                        data.address,
                        data.city,
                        data.state,
                        data.country,
                        data.zipcode
                    ].filter(Boolean).join(', '),

                    social_links: {
                        facebook: data.facebook,
                        twitter: data.twitter,
                        instagram: data.instagram,
                        linkedin: data.linkedin,
                        youtube: data.youtube,
                    },

                    whatsapp: {
                        number: data.whatsapp_no,
                        text: data.whatsapp_text,
                    },

                    map_code: data.map_code
                }
            }))

        } catch (error) {
            console.error('Contact API Error:', error)
            return res.status(500).json({
                success: false,
                message: 'Server error'
            })
        }
    }
}

module.exports = contactController
