const { db } = require('../../config/db')
const { eq } = require('drizzle-orm')
const { wl_cms_pages } = require('../../schema/cms/cms')

const pageModel = {
    getAll: async () => {
        return await db
            .select()
            .from(wl_cms_pages)
            .where(eq(wl_cms_pages.status, '1'))
            .orderBy(wl_cms_pages.page_name)
    },

    getById: async (pageId) => {
        const result = await db
            .select()
            .from(wl_cms_pages)
            .where(eq(wl_cms_pages.page_id, pageId))
            .limit(1)

        return result[0] || null
    },

    getByTitle: async (title) => {
        const result = await db
            .select()
            .from(wl_cms_pages)
            .where(eq(wl_cms_pages.page_name, title))
            .limit(1)

        return result[0] || null
    }
}

module.exports = {pageModel}
