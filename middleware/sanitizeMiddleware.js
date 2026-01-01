const helmet = require('helmet')
const express = require('express')

function applySecurity(app) {
  app.use(helmet())
  app.use(express.json({ limit: '10kb' }))
}

module.exports = applySecurity
