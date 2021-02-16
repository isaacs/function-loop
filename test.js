const t = require('tap')
const loop = require('./')
const obj = {}

t.test('basic passing operation', function (t) {
  let i = 0
  loop(obj, [
    function () {
      t.equal(this, obj, 'this is correct 1')
      t.equal(i, 0, '0')
      i++
    },
    function () {
      t.equal(this, obj, 'this is correct 2')
      t.equal(i++, 1, '1')
      return Promise.resolve(true)
    },
    function () {
      t.equal(this, obj, 'this is correct 3')
      t.equal(i++, 2, '2')
      return new Promise(res => setTimeout(res))
    },
    function () {
      t.equal(this, obj, 'this is correct 4')
      t.equal(i++, 3, '3')
      return Promise.resolve('ok')
    }
  ], function () {
    t.equal(this, obj, 'this is correct 5')
    t.equal(i++, 4, '4')
    t.end()
  }, function (er) {
    throw er
  })
  t.equal(i, 2, '2, after loop() call')
})

t.test('throws', function (t) {
  loop(obj, [
    function () {
      t.equal(this, obj, 'this is correct')
      throw new Error('foo')
    },
    function () {
      t.fail('should not get here')
    }
  ], function () {
    t.fail('should not get here')
  }, function (er) {
    t.match(er, { message: 'foo' })
    t.end()
  })
})

t.test('all sync', function (t) {
  let i = 0
  loop(obj, [
    function () { t.equal(i++, 0) },
    function () { t.equal(i++, 1) },
    function () { t.equal(i++, 2) },
    function () { t.equal(i++, 3) },
    function () { t.equal(i++, 4) }
  ], function () {
    t.equal(i++, 5)
  }, function (er) {
    throw er
  })
  t.equal(i, 6)
  t.end()
})

t.test('broken promise', function (t) {
  loop(obj, [
    function () {
      t.equal(this, obj, 'this is correct')
      return Promise.reject(new Error('foo'))
    },
    function () {
      t.fail('should not get here')
    }
  ], function () {
    t.fail('should not get here')
  }, function (er) {
    t.equal(this, obj, 'this is correct')
    t.match(er, { message: 'foo' })
    t.end()
  })
})
