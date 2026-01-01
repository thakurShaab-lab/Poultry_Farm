require('dotenv').config()
const mysql = require('mysql2/promise')
const {drizzle} = require('drizzle-orm/mysql2')

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'test',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
})

async function testDbConnection() {
  try {
    console.log("🧩 Attempting to connect to the database...")
    const connection = await pool.getConnection()
    console.log("✅ Connected to the database successfully!")
    connection.release()
  } catch (error) {
    console.error("❌ Failed to connect to the database:", error.message)
  }
}

testDbConnection()

const db = drizzle(pool)

module.exports = { db, pool }
