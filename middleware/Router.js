var router = require('../models/Router')

// The middleware function to save the current route
// for ALL routes using this middleware
module.exports = function () {
  return function (req, res, next) {
    router.setCurrentURL(req.path)
    next()
  }
}
