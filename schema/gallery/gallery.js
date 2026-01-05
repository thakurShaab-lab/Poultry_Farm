const { mysqlTable, int, varchar, text, datetime, mysqlEnum } = require('drizzle-orm/mysql-core')

const wl_gallery = mysqlTable('wl_gallery', {

    gallery_id: int('gallery_id')
        .primaryKey()
        .autoincrement(),

    parent_id: int('parent_id')
        .notNull(),

    gallery_title: varchar('gallery_title', { length: 255 })
        .notNull(),

    gallery_image: varchar('gallery_image', { length: 255 })
        .default(null),

    embed_code: text('embed_code')
        .default(null),

    gallery_desc: text('gallery_desc')
        .default(null),

    type: mysqlEnum('type', ['1', '2'])
        .notNull()
        .default('1'),

    gallery_alt: varchar('gallery_alt', { length: 255 })
        .default(null),

    friendly_url: varchar('friendly_url', { length: 255 })
        .default(null),

    status: mysqlEnum('status', ['0', '1'])
        .notNull()
        .default('1'),

    post_date: datetime('post_date')
        .notNull(),

    gallery_date_updated: datetime('gallery_date_updated')
        .default(null),

    sort_order: int('sort_order')
        .notNull()
        .default(0),

    ip_address: varchar('ip_address', { length: 255 })
        .default(null),
})

module.exports = { wl_gallery }
