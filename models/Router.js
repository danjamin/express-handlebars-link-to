var _routes = {}
var _pathsHash = {}
var _currentURL = ''

var _replaceUpToFirstSlash = function (str, replacement) {
  var index = str.indexOf('/')

  if (index === -1) {
    return replacement
  } else {
    return replacement + str.substring(index)
  }
}

module.exports = {
  setCurrentURL: function (currentURL) {
    _currentURL = currentURL
  },

  getCurrentURL: function () {
    return _currentURL
  },

  define: function (name, path) {
    // TODO: DO NOT allow string patterns like '/ab?cd'
    // TODO: DO NOT allow regex patterns like /^5$/
    // TODO: DO NOT allow param restrictions e.g. '/user/:id([0-9]+)'

    if (_routes.hasOwnProperty(name)) {
      throw 'Route with name "' + name + '" already defined!'
    }

    if (_pathsHash.hasOwnProperty(path)) {
      throw 'Path pattern "' + path +  '" already defined!'
    }

    _routes[name] = path
    _pathsHash[path] = 1

    return path
  },

  reset: function () {
    _routes = {}
    _pathsHash = {}
    _currentURL = ''
  },

  getRawPath: function (name) {
    return _routes[name]
  },

  getPath: function(name, param1, paramN) {
    var params = Array.prototype.slice.call(arguments, 1)
    return this.resolvePath(
      this.getRawPath(name),
      params
    )
  },

  resolvePath: function (path, params) {
    // TODO: warn about too many or too few params
    // TODO: add cache here!

    var resolvedPath = ''
    var currentParamIndex = 0
    var j

    function _isValidCharacter(c) {
      return /^[0-9a-z\-\_\$]$/i.test(c)
    }

    function _findEndIndex(path, i) {
      do {
        i += 1
      } while (_isValidCharacter(path[i]))

      // backup to last 'valid' character
      return i - 1
    }

    for (var i = 0; i < path.length; i++) {
      if (path[i] === ':') {
        j = _findEndIndex(path, i)

        // handle '::'
        if (j !== i) {
          i = j
          resolvedPath += params[currentParamIndex]
          currentParamIndex += 1
        } else {
          resolvedPath += path[i]
        }
      } else {
        resolvedPath += path[i]
      }
    }

    return resolvedPath
  },

  isMatch: function (url, path, params) {
    var resolvedPath = this.resolvePath(path, params)
    return url === resolvedPath
  },

  logAllDefinedRoutes: function () {
    console.log('ROUTES')

    for (var key in _routes) {
      if (_routes.hasOwnProperty(key)) {
        console.log('  ' + key + ': ' + _routes[key])
      }
    }
  }
}
