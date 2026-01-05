const {
    mysqlTable,
    int,
    varchar,
    text,
    datetime,
    mysqlEnum,
} = require('drizzle-orm/mysql-core')

const wl_enquiry = mysqlTable('wl_enquiry', {
    id: int('id')
        .primaryKey()
        .autoincrement(),

    type: mysqlEnum('type', ['1', '2', '3', '4', '5', '6', '7', '8'])
        .notNull()
        .default('1'),

    product_service: varchar('product_service', { length: 255 })
        .default(null),

    service_type: varchar('service_type', { length: 150 })
        .default(null),

    email: varchar('email', { length: 80 })
        .notNull(),

    first_name: varchar('first_name', { length: 30 })
        .notNull(),

    last_name: varchar('last_name', { length: 30 })
        .notNull(),

    company_name: varchar('company_name', { length: 60 })
        .default(null),

    country: varchar('country', { length: 200 })
        .default(null),

    state: varchar('state', { length: 50 })
        .default(null),

    city: varchar('city', { length: 50 })
        .default(null),

    phone_number: varchar('phone_number', { length: 20 })
        .default(null),

    ext_number: varchar('ext_number', { length: 50 })
        .default(null),

    mobile_number: varchar('mobile_number', { length: 20 })
        .default(null),

    fax_number: varchar('fax_number', { length: 30 })
        .default(null),

    address: varchar('address', { length: 220 })
        .default(null),

    zipcode: varchar('zipcode', { length: 10 })
        .default(null),

    requirement: text('requirement')
        .default(null),

    message: text('message')
        .notNull(),

    status: mysqlEnum('status', ['1', '2'])
        .notNull(),

    reply_status: mysqlEnum('reply_status', ['Y', 'N'])
        .notNull()
        .default('N'),

    receive_date: datetime('receive_date')
        .notNull(),

    customers_id: int('customers_id')
        .notNull()
        .default(0),

    product_id: int('product_id')
        .notNull()
        .default(0),

    resume: varchar('resume', { length: 150 })
        .default(null),

    applied_post: varchar('applied_post', { length: 150 })
        .default(null),

    qualification: varchar('qualification', { length: 150 })
        .default(null),

    expiercence: varchar('expiercence', { length: 50 })
        .default(null),

    quantity: int('quantity')
        .default(null),
})



module.exports = { wl_enquiry }