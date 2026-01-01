const { validationResult } = require('express-validator')

function validateRequest(req, res, next) {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.status(201).json({
      success: false,
      message: errors.array()[0].msg,
    });
  }

  next()
}

module.exports = validateRequest
