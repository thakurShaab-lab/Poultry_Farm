const { mysqlTable, int, varchar, text, datetime, mysqlEnum } = require('drizzle-orm/mysql-core')

const wl_faq = mysqlTable('wl_faq', {
    faq_id: int('faq_id')
        .primaryKey()
        .autoincrement(),

    faq_parent_id: int('faq_parent_id')
        .notNull()
        .default(0),

    faq_question: varchar('faq_question', { length: 225 })
        .notNull(),

    faq_answer: text('faq_answer')
        .notNull(),

    sort_order: int('sort_order')
        .default(null),

    status: mysqlEnum('status', ['1', '2', '3'])
        .notNull()
        .default('1'),

    faq_date_added: datetime('faq_date_added')
        .notNull(),
})

module.exports = { wl_faq }