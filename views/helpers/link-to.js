var router = require('../../models/Router')

// Exports a helper!
module.exports = function (routeName, params, options) {
  var args = Array.prototype.slice.call(arguments, 0)
  var attrs = ''
  var currentURL
  var isMatch
  var rawPath

  // Either 2 args (routeName and options)
  // OR >=3 args (routeName, 1 or more params, and options)
  routeName = args[0] // first
  params = args.length === 2 ? [] : args.slice(1, args.length - 1) // the rest
  options = args[args.length - 1] // last

  rawPath = router.getRawPath(routeName)
  currentURL = router.getCurrentURL()
  isMatch = router.isMatch(currentURL, rawPath, params)

  // Add active class when there is a match
  if (isMatch) {
    if (options.hash.hasOwnProperty('class')) {
      options.hash['class'] += ' active'
    } else {
      options.hash['class'] = 'active'
    }
  }

  // process all hashed values as attrs
  for (var key in options.hash) {
    if (options.hash.hasOwnProperty(key)) {
      attrs += key + '="' + options.hash[key] + '" '
    }
  }

  if (isMatch) {
    return '<span ' + attrs + '>' + options.fn(this) + '</span>'
  } else {
    return '<a ' + attrs + ' href="' + router.resolvePath(rawPath, params) +
      '">' + options.fn(this) + '</a>'
  }
}
