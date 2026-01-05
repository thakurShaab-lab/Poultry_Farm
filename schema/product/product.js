const {
    mysqlTable,
    int,
    varchar,
    float,
    text,
    datetime,
    date,
    mysqlEnum,
} = require('drizzle-orm/mysql-core');

const wl_products = mysqlTable('wl_products', {
    products_id: int('products_id').primaryKey().autoincrement(),

    category_id: int('category_id').notNull(),

    category_links: varchar('category_links', { length: 80 }).notNull(),

    product_name: varchar('product_name', { length: 100 }).notNull(),

    friendly_url: varchar('friendly_url', { length: 200 }).default(null),

    product_code: varchar('product_code', { length: 64 }).notNull(),

    product_price: float('product_price', { precision: 15, scale: 2 })
        .notNull()
        .default(0.0),

    product_discounted_price: float('product_discounted_price', {
        precision: 15,
        scale: 2,
    })
        .notNull()
        .default(0.0),

    product_discount_percent: float('product_discount_percent', {
        precision: 10,
        scale: 2,
    }).default(0.0),

    product_tax: float('product_tax', { precision: 10, scale: 2 })
        .notNull()
        .default(0.0),

    products_description: text('products_description').default(null),

    products_specification: text('products_specification').default(null),

    youtube_video: varchar('youtube_video', { length: 455 }).default(null),

    brand_id: int('brand_id').default(null),

    is_hot: mysqlEnum('is_hot', ['1', '0'])
        .notNull()
        .default('0'),

    start_date: date('start_date').default(null),

    fromdate_strtotime: int('fromdate_strtotime').default(null),

    end_date: date('end_date').default(null),

    end_date_strtotome: int('end_date_strtotome').default(null),

    product_quantity: int('product_quantity').notNull().default(0),

    used_quantity: int('used_quantity').notNull().default(0),

    status: mysqlEnum('status', ['0', '1', '2'])
        .notNull()
        .default('1'),

    product_added_date: datetime('product_added_date').default(null),

    product_updated_date: datetime('product_updated_date').default(null),

    product_alt: varchar('product_alt', { length: 100 }).default(null),

    xls_type: mysqlEnum('xls_type', ['0', '1'])
        .notNull()
        .default('0'),

    product_brochure: varchar('product_brochure', { length: 255 }).default(null),

    item_age: varchar('item_age', { length: 155 }).default(null),

    reason_id: int('reason_id').default(null),

    completion_days: varchar('completion_days', { length: 155 }).default(null),

    member_id: int('member_id').notNull(),

    accept_type: mysqlEnum('accept_type', ['0', '1', '2', '3'])
        .default('0'),
});

module.exports = { wl_products };