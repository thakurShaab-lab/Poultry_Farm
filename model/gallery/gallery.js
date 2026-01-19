const { db } = require('../../config/db')
const { eq, and, desc } = require('drizzle-orm')
const { wl_gallery } = require('../../schema/gallery/gallery')


const galleryModel = {

    list: async ({ type, page = 1, limit = 10 }) => {
        const offset = (page - 1) * limit

        const conditions = [
            eq(wl_gallery.status, '1')
        ]

        if (type) {
            conditions.push(eq(wl_gallery.type, String(type)))
        }

        const data = await db.select().from(wl_gallery).where(and(...conditions)).limit(Number(limit)).offset(Number(offset))

        const totalResult = await db
            .select({ count: wl_gallery.gallery_id })
            .from(wl_gallery)
            .where(and(...conditions))

        return {
            data,
            total: totalResult.length
        }
    },

    getById: async (id) => {
        const result = await db
            .select()
            .from(wl_gallery)
            .where(eq(wl_gallery.gallery_id, Number(id)))
            .limit(1)

        return result[0] || null
    }
}

module.exports = {galleryModel}