const {
    mysqlTable,
    int,
    varchar,
    text,
    datetime,
    date,
    mysqlEnum,
    float,
    bigint,
} = require('drizzle-orm/mysql-core')

const tbl_admin = mysqlTable('tbl_admin', {

    admin_id: int('admin_id')
        .primaryKey()
        .autoincrement(),

    admin_type: mysqlEnum('admin_type', ['1', '2', '3'])
        .notNull()
        .default('2'),

    admin_key: varchar('admin_key', { length: 15 })
        .notNull(),

    admin_username: varchar('admin_username', { length: 50 })
        .notNull(),

    admin_name: varchar('admin_name', { length: 155 })
        .default(null),

    admin_password: varchar('admin_password', { length: 30 })
        .default(null),

    admin_email: varchar('admin_email', { length: 255 })
        .notNull(),

    weight_price: varchar('weight_price', { length: 55 })
        .default(null),

    litigation_days: int('litigation_days')
        .default(null),

    admin_last_login: datetime('admin_last_login')
        .notNull(),

    address: text('address')
        .default(null),

    city: varchar('city', { length: 100 })
        .default(null),

    state: varchar('state', { length: 100 })
        .default(null),

    country: varchar('country', { length: 100 })
        .default(null),

    zipcode: varchar('zipcode', { length: 50 })
        .default(null),

    phone: varchar('phone', { length: 50 })
        .default(null),

    mobile: varchar('mobile', { length: 15 })
        .default(null),

    website: varchar('website', { length: 255 })
        .default(null),

    fax: varchar('fax', { length: 50 })
        .default(null),

    contact_person: varchar('contact_person', { length: 50 })
        .default(null),

    contact_phone: varchar('contact_phone', { length: 50 })
        .default(null),

    contact_email: varchar('contact_email', { length: 50 })
        .default(null),

    cod_amount: float('cod_amount', { precision: 10, scale: 2 })
        .notNull(),

    post_date: date('post_date')
        .notNull(),

    status: mysqlEnum('status', ['0', '1', '2'])
        .notNull()
        .default('1'),

    total_hits: bigint('total_hits', { mode: 'number' })
        .notNull()
        .default(0),

    facebook_link: varchar('facebook_link', { length: 250 })
        .default(null),

    twitter_link: varchar('twitter_link', { length: 250 })
        .default(null),

    linkedin_link: varchar('linkedin_link', { length: 250 })
        .default(null),

    google_link: varchar('google_link', { length: 250 })
        .default(null),

    youtube_link: varchar('youtube_link', { length: 250 })
        .default(null),

    instagram_link: varchar('instagram_link', { length: 250 })
        .default(null),

    google_analytics_id: varchar('google_analytics_id', { length: 50 })
        .default(null),

    google_web_code: text('google_web_code')
        .default(null),

    map_code: text('map_code')
        .default(null),

    vat: float('vat', { precision: 10, scale: 2 })
        .notNull()
        .default(0.00),

    deal_price: int('deal_price')
        .default(null),

    deal_start_date: datetime('deal_start_date')
        .default(null),

    deal_end_date: datetime('deal_end_date')
        .default(null),

    exclusive_deal_start_date: datetime('exclusive_deal_start_date')
        .default(null),

    exclusive_deal_end_date: datetime('exclusive_deal_end_date')
        .default(null),

    whatsapp_text: varchar('whatsapp_text', { length: 100 })
        .default(null),

    whatsapp_no: varchar('whatsapp_no', { length: 100 })
        .default(null),

    footer_time: varchar('footer_time', { length: 255 })
        .default(null),

    completed_projets: varchar('completed_projets', { length: 155 })
        .default(null),

    satisfied_customers: varchar('satisfied_customers', { length: 155 })
        .default(null),

    success_rates: varchar('success_rates', { length: 155 })
        .default(null),

    app_id: varchar('app_id', { length: 128 }),
    device_id: varchar('device_id', { length: 128 }),
    app_type: varchar('app_type', { length: 128 }),
})

module.exports = { tbl_admin }
