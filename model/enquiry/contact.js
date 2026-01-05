const { db } = require('../../config/db')
const { eq } = require('drizzle-orm')
const { tbl_admin } = require('../../schema/admin/admin')

const contactModel = {

    getContactData: async () => {
        const result = await db
            .select({
                phone: tbl_admin.phone,
                mobile: tbl_admin.mobile,
                email: tbl_admin.admin_email,
                contact_email: tbl_admin.contact_email,

                address: tbl_admin.address,
                city: tbl_admin.city,
                state: tbl_admin.state,
                country: tbl_admin.country,
                zipcode: tbl_admin.zipcode,

                facebook: tbl_admin.facebook_link,
                twitter: tbl_admin.twitter_link,
                instagram: tbl_admin.instagram_link,
                linkedin: tbl_admin.linkedin_link,
                youtube: tbl_admin.youtube_link,

                whatsapp_no: tbl_admin.whatsapp_no,
                whatsapp_text: tbl_admin.whatsapp_text,

                map_code: tbl_admin.map_code,
            })
            .from(tbl_admin)
            .where(eq(tbl_admin.status, '1'))
            .limit(1)

        return result[0] || null
    }
}

module.exports = contactModel
