const { db } = require('../../config/db')
const { eq, and, asc } = require('drizzle-orm')
const { wl_faq } = require('../../schema/faq/faq')

const faqModel = {

    getAll: async () => {
        return await db
            .select({
                faq_id: wl_faq.faq_id,
                faq_question: wl_faq.faq_question,
                faq_answer: wl_faq.faq_answer,
                faq_date_added: wl_faq.faq_date_added
            })
            .from(wl_faq)
            .where(eq(wl_faq.status, '1'))
            .orderBy(
                asc(wl_faq.sort_order),
                asc(wl_faq.faq_id)
            )
    },

    getById: async (faqId) => {
        const result = await db
            .select({
                faq_id: wl_faq.faq_id,
                faq_question: wl_faq.faq_question,
                faq_answer: wl_faq.faq_answer,
                faq_date_added: wl_faq.faq_date_added
            })
            .from(wl_faq)
            .where(
                and(
                    eq(wl_faq.faq_id, Number(faqId)),
                    eq(wl_faq.status, '1')
                )
            )
            .limit(1)

        return result[0] || null
    }
}

module.exports = {faqModel}