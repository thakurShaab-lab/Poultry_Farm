const { db } = require('../../config/db')
const { eq } = require('drizzle-orm')
const { wl_header_images } = require('../../schema/banners/banner')

const headerModel = {
    getActive: async () => {
        return await db
            .select()
            .from(wl_header_images)
            .where(eq(wl_header_images.status, '1'))
    }
}

module.exports = headerModel
