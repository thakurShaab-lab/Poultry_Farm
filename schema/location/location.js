const { mysqlTable, int, varchar, datetime, mysqlEnum } = require('drizzle-orm/mysql-core')

const wl_locations = mysqlTable('wl_locations', {
    location_id: int('location_id')
        .primaryKey()
        .autoincrement(),

    location_name: varchar('location_name', { length: 32 })
        .notNull(),

    friendly_url: varchar('friendly_url', { length: 150 })
        .default(null),

    location_url: varchar('location_url', { length: 255 })
        .default(null),

    location_image: varchar('location_image', { length: 64 })
        .default(null),

    location_date_added: datetime('location_date_added')
        .default(null),

    location_date_updated: datetime('location_date_updated')
        .default(null),

    sort_order: int('sort_order')
        .default(null),

    status: mysqlEnum('status', ['0', '1', '2'])
        .notNull()
        .default('1'),
})

module.exports = { wl_locations }