var mocha = require('mocha')
var assert = require('assert')
var router = require('../../models/Router')

var describe = mocha.describe
var it = mocha.it
var beforeEach = mocha.beforeEach

describe('Router', function () {
  describe('#resolvePath()', function () {
    it('should return static paths unchanged', function () {
      assert.equal(router.resolvePath('/'), '/')
      assert.equal(router.resolvePath('/login'), '/login')
      assert.equal(router.resolvePath('/sign/in/yo'), '/sign/in/yo')
    })

    it('should handle a simple single param path', function () {
      assert.equal(router.resolvePath('/user/:id', [5]), '/user/5')
      assert.equal(router.resolvePath('/user/:id0', ['Dan']), '/user/Dan')
      assert.equal(
        router.resolvePath('/user/:id/extra', [5]),
        '/user/5/extra'
      )
      assert.equal(
        router.resolvePath('/:id/user', [5]),
        '/5/user'
      )
    })

    it('should handle two params path', function () {
      assert.equal(
        router.resolvePath('/user/:id/:other', [5, 'x']),
        '/user/5/x'
      )
      assert.equal(
        router.resolvePath('/user/:id:other', [5, 'x']),
        '/user/5x'
      )
      assert.equal(
        router.resolvePath('/user/:id,:o', [5, 'x']),
        '/user/5,x'
      )
    })

    it('should handle double colons', function () {
      assert.equal(
        router.resolvePath('/user/::id', [5]),
        '/user/:5'
      )
      assert.equal(
        router.resolvePath('/user/::', []),
        '/user/::'
      )
      assert.equal(
        router.resolvePath('/user/::/', []),
        '/user/::/'
      )
    })

    it('should handle a trailing colon', function () {
      assert.equal(
        router.resolvePath('/user/:id:', [5]),
        '/user/5:'
      )
      assert.equal(
        router.resolvePath('/user/:id:,+a', [5]),
        '/user/5:,+a'
      )
    })
  })

  describe('#getPath()', function () {
    beforeEach(function () {
      router.reset()
    })

    it('should resolve static paths as is', function () {
      router.define('index', '/')
      assert.equal(router.getPath('index'), '/')
    })

    it('should handle a simple single param path', function () {
      router.define('user', '/user/:id')
      assert.equal(router.getPath('user', 5), '/user/5')
    })

    it('should handle two params path', function () {
      router.define('user', '/user/:id/:other')
      assert.equal(
        router.getPath('user', 5, 'x'),
        '/user/5/x'
      )
    })
  })

  describe('#isMatch()', function () {
    it('should match static paths', function () {
      assert.equal(router.isMatch('/', '/', []), true)
      assert.equal(router.isMatch('/', '/a', []), false)
      assert.equal(router.isMatch('/signin', '/signin', []), true)
    })

    it('should match simple single param path', function () {
      assert.equal(router.isMatch('/user/5', '/user/:id', [5]), true)
      assert.equal(router.isMatch('/user/Dan', '/user/:id0', ['Dan']), true)
      assert.equal(router.isMatch('/user/5/extra', '/user/:id/extra', [5]), true)
      assert.equal(router.isMatch('/5/user', '/:id/user', [5]), true)
    })
  })
})
