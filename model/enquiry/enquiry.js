const { db } = require('../../config/db')
const { wl_enquiry } = require('../../schema/enquiry/enquiry')

const contactUsModel = {
    create: async (data) => {
        const result = await db.insert(wl_enquiry).values(data)
        return result
    }
}

module.exports = contactUsModel
