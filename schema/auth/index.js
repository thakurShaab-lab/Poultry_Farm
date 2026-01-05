const {
  mysqlTable,
  int,
  varchar,
  date,
  datetime,
  mysqlEnum,
} = require('drizzle-orm/mysql-core')

const wl_customers = mysqlTable('wl_customers', {

  customers_id: int('customers_id')
    .primaryKey()
    .autoincrement(),

  user_name: varchar('user_name', { length: 80 })
    .notNull(),

  password: varchar('password', { length: 100 })
    .notNull(),

  old_password: varchar('old_password', { length: 255 })
    .notNull(),

  title: varchar('title', { length: 10 }),

  farm_name: varchar('farm_name', { length: 455 }),

  first_name: varchar('first_name', { length: 32 }),

  last_name: varchar('last_name', { length: 32 }),

  gender: mysqlEnum('gender', ['Male', 'Female'])
    .default('Male'),

  birth_date: date('birth_date'),

  customer_photo: varchar('customer_photo', { length: 32 }),

  phone_number: varchar('phone_number', { length: 32 }),

  mobile_number: varchar('mobile_number', { length: 32 }),

  fax_number: varchar('fax_number', { length: 32 }),

  actkey: varchar('actkey', { length: 32 })
    .notNull(),

  status: mysqlEnum('status', ['0', '1', '2', '3'])
    .notNull()
    .default('0'),

  is_verified: mysqlEnum('is_verified', ['0', '1'])
    .notNull()
    .default('0'),

  is_verified_mobile: mysqlEnum('is_verified_mobile', ['0', '1'])
    .notNull()
    .default('0'),

  login_type: mysqlEnum('login_type', ['normal', 'facebook', 'twitter'])
    .notNull()
    .default('normal'),

  account_created_date: datetime('account_created_date'),

  current_login: datetime('current_login'),

  last_login_date: datetime('last_login_date'),

  ip_address: varchar('ip_address', { length: 25 })
    .notNull(),

  is_blocked: mysqlEnum('is_blocked', ['0', '1'])
    .notNull()
    .default('0'),

  block_time: datetime('block_time')
    .notNull()
    .default('0000-00-00 00:00:00'),

  number_of_login_try: int('number_of_login_try')
    .notNull()
    .default(0),

  replied: mysqlEnum('replied', ['Y', 'N'])
    .notNull()
    .default('N'),

  city: varchar('city', { length: 250 }),

  address: varchar('address', { length: 255 }),

  state: varchar('state', { length: 255 }),

  country: varchar('country', { length: 255 }),

  location: varchar('location', { length: 255 }),

  farm_document: varchar('farm_document', { length: 255 }),

  zipcode: varchar('zipcode', { length: 255 }),

  country_id: int('country_id'),

  state_id: int('state_id'),

  city_id: int('city_id'),

  location_id: int('location_id'),

  country_code: varchar('country_code', { length: 155 }),

  mob_std_code: varchar('mob_std_code', { length: 155 }),

  register_type: int('register_type')
    .default(0),

  register_type_val: varchar('register_type_val', { length: 55 }),
})

module.exports = { wl_customers }