require('dotenv').config()
const mysql = require('mysql2/promise')
const { drizzle } = require('drizzle-orm/mysql2')
const schema = require('../models/index')

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'test',
})

const db = drizzle(pool, { schema })

module.exports = db