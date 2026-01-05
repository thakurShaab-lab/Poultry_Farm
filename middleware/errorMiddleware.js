function errorMiddleware(err, req, res, next) {
  console.error('❌ Error:', err)

  if (res.headersSent) return next(err)

  let status = err.statusCode || 500
  let message = err.message || 'Internal Server Error'

  if (err.name === 'ZodError') {
      status = 201
      message = err.errors[0]?.message
  }

  if (err.name === 'JsonWebTokenError') {
      status = 201
      message = 'Invalid token'
  }

  res.status(status).json({
      success: false,
      message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  })
}

module.exports = errorMiddleware
