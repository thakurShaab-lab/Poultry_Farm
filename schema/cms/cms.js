const { mysqlTable, int, varchar, text, longtext, datetime, mysqlEnum, } = require('drizzle-orm/mysql-core')

const wl_cms_pages = mysqlTable('wl_cms_pages', {
    page_id: int('page_id')
        .primaryKey()
        .autoincrement(),

    parent_id: int('parent_id')
        .notNull()
        .default(0),

    page_name: varchar('page_name', { length: 50 })
        .notNull(),

    friendly_url: varchar('friendly_url', { length: 50 })
        .notNull(),

    page_description: longtext('page_description')
        .notNull(),

    page_short_description: text('page_short_description'),

    image: varchar('image', { length: 50 })
        .notNull(),

    status: mysqlEnum('status', ['0', '1', '2'])
        .notNull()
        .default('1'),

    page_updated_date: datetime('page_updated_date')
        .notNull()
})

module.exports = { wl_cms_pages }
