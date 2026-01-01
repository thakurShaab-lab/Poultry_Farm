require('dotenv').config()
const { defineConfig } = require('drizzle-kit')

/** @type {import('drizzle-kit').Config} */
module.exports = defineConfig({
  out: './drizzle/migrations',
  schema: './models/index.js',
  // driver: 'mysql2',
  dialect: 'mysql',
  dbCredentials: {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD || undefined,
    database: process.env.DB_NAME,
  },
})