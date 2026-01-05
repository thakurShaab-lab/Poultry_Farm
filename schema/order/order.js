const {
    mysqlTable,
    int,
    varchar,
    decimal,
    float,
    char,
    text,
    datetime,
    mysqlEnum,
  } = require("drizzle-orm/mysql-core")
  
const wl_order = mysqlTable("wl_order", {
    order_id: int("order_id").primaryKey().autoincrement(),
  
    customers_id: int("customers_id").notNull().default(0),
  
    customer_type: varchar("customer_type", { length: 100 })
      .default("Member"),
  
    invoice_number: varchar("invoice_number", { length: 30 }).notNull(),
  
    products_id: varchar("products_id", { length: 255 }).default(null),
  
    product_name: varchar("product_name", { length: 255 }).default(null),
  
    first_name: varchar("first_name", { length: 50 }).notNull(),
  
    last_name: varchar("last_name", { length: 50 }).default(null),
  
    mobile_number: varchar("mobile_number", { length: 50 }).default(null),
  
    phone: varchar("phone", { length: 50 }).default(null),
  
    email: varchar("email", { length: 50 }).notNull(),
  
    billing_name: varchar("billing_name", { length: 100 }).default(null),
  
    billing_address: varchar("billing_address", { length: 223 }).default(null),
  
    billing_phone: varchar("billing_phone", { length: 50 }).default(null),
  
    billing_mobile: varchar("billing_mobile", { length: 25 }).default(null),
  
    billing_fax: varchar("billing_fax", { length: 50 }).default(null),
  
    billing_zipcode: varchar("billing_zipcode", { length: 50 }).default(null),
  
    billing_country: varchar("billing_country", { length: 100 }).default(null),
  
    billing_state: varchar("billing_state", { length: 50 }).default(null),
  
    billing_city: varchar("billing_city", { length: 50 }).default(null),
  
    reason_comment: varchar("reason_comment", { length: 255 }).default(null),
  
    total_amount: decimal("total_amount", { precision: 15, scale: 4 }).notNull(),
  
    product_price: float("product_price", { precision: 10, scale: 2 }).default(null),
  
    vat_applied_cent: float("vat_applied_cent", { precision: 10, scale: 2 })
      .notNull()
      .default(0.0),
  
    currency_code: char("currency_code", { length: 3 }).notNull(),
  
    currency_symbol: char("currency_symbol", { length: 10 }).notNull(),
  
    currency_value: decimal("currency_value", { precision: 14, scale: 6 }).notNull(),
  
    order_status: mysqlEnum("order_status", [
      "Pending",
      "Return",
      "Canceled",
      "Delivered",
      "Ready For Dispatch",
      "Rejected",
      "Deleted",
    ])
      .notNull()
      .default("Pending"),
  
    order_received_date: datetime("order_received_date")
      .default("0000-00-00 00:00:00"),
  
    order_delivery_date: datetime("order_delivery_date")
      .default("0000-00-00 00:00:00"),
  
    payment_method: varchar("payment_method", { length: 200 }).default(null),
  
    payment_status: mysqlEnum("payment_status", ["Paid", "Unpaid"])
      .notNull()
      .default("Unpaid"),
  
    bill_number: varchar("bill_number", { length: 50 }).notNull(),
  
    reason: text("reason").default(null),
  
    farm_name: varchar("farm_name", { length: 255 }).default(null),
  
    loction: varchar("loction", { length: 255 }).default(null),
  
    product_quantity: int("product_quantity").default(0),
  
    comment: varchar("comment", { length: 255 }).default(null),
  })

  module.exports = wl_order