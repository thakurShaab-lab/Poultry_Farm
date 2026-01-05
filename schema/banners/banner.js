const {
    mysqlTable,
    int,
    varchar,
    datetime,
    mysqlEnum,
} = require('drizzle-orm/mysql-core')

const wl_header_images = mysqlTable('wl_header_images', {
    id: int('id')
        .primaryKey()
        .autoincrement(),

    header_image: varchar('header_image', { length: 200 })
        .notNull(),

    header_url: varchar('header_url', { length: 255 })
        .default(null),

    line_one: varchar('line_one', { length: 80 })
        .default(null),

    line_two: varchar('line_two', { length: 255 })
        .default(null),

    line_three: varchar('line_three', { length: 255 })
        .default(null),

    line_four: varchar('line_four', { length: 255 })
        .default(null),

    line_five: varchar('line_five', { length: 255 })
        .default(null),

    status: mysqlEnum('status', ['1', '0', '2'])
        .notNull(),

    added_date: datetime('added_date')
        .notNull(),
})

const wl_banners = mysqlTable('wl_banners', {
    banner_id: int('banner_id')
        .primaryKey()
        .autoincrement(),

    banner_position: varchar('banner_position', { length: 100 })
        .default(null),

    banner_image: varchar('banner_image', { length: 200 })
        .default(null),

    banner_url: varchar('banner_url', { length: 170 })
        .default(null),

    banner_page: varchar('banner_page', { length: 30 })
        .default(null),

    banner_title: varchar('banner_title', { length: 255 })
        .default(null),

    status: mysqlEnum('status', ['1', '0'])
        .default('1'),

    clicks: int('clicks')
        .notNull()
        .default(0),

    banner_added_date: datetime('banner_added_date')
        .default(null),

    banner_start_date: datetime('banner_start_date')
        .default(null),

    banner_end_date: datetime('banner_end_date')
        .default(null),
})

module.exports = { wl_header_images, wl_banners }
