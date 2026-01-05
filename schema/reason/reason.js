const {
    mysqlTable,
    int,
    varchar,
    text,
    datetime,
    tinyint,
    mysqlEnum,
  } = require("drizzle-orm/mysql-core");
  
  const reasons = mysqlTable("reasons", {
    reason_id: int("reason_id").primaryKey().autoincrement(),
  
    reason_name: varchar("reason_name", { length: 255 }).notNull(),
  
    reason_comment: text("reason_comment").default(null),
  
    reason_type: tinyint("reason_type")
      .notNull()
      .default(1),
  
    reason_date_added: datetime("reason_date_added").default(null),
  
    reason_date_updated: datetime("reason_date_updated").default(null),
  
    sort_order: int("sort_order").default(null),
  
    status: mysqlEnum("status", ["0", "1", "2"])
      .notNull()
      .default("1"),
  });
  
  module.exports = { reasons };
  