import t from 'tap'
import loop from '../dist/cjs/index.js'

t.test('basic passing operation', function (t) {
  let i = 0
  loop(
    [
      function () {
        t.equal(i, 0, '0')
        i++
      },
      function () {
        t.equal(i++, 1, '1')
        return Promise.resolve(true)
      },
      function () {
        t.equal(i++, 2, '2')
        return new Promise(res => setTimeout(res))
      },
      function () {
        t.equal(i++, 3, '3')
        return Promise.resolve('ok')
      },
    ],
    function () {
      t.equal(i++, 4, '4')
      t.end()
    },
    function (er) {
      throw er
    }
  )
  t.equal(i, 2, '2, after loop() call')
})

t.test('throws', function (t) {
  loop(
    [
      function () {
        throw new Error('foo')
      },
      function () {
        t.fail('should not get here')
      },
    ],
    function () {
      t.fail('should not get here')
    },
    function (er) {
      t.match(er, { message: 'foo' })
      t.end()
    }
  )
})

t.test('all sync', function (t) {
  let i = 0
  loop(
    [
      function () {
        t.equal(i++, 0)
      },
      function () {
        t.equal(i++, 1)
      },
      function () {
        t.equal(i++, 2)
      },
      function () {
        t.equal(i++, 3)
      },
      function () {
        t.equal(i++, 4)
      },
    ],
    function () {
      t.equal(i++, 5)
    },
    function (er) {
      throw er
    }
  )
  t.equal(i, 6)
  t.end()
})

t.test('broken promise', function (t) {
  loop(
    [
      function () {
        return Promise.reject(new Error('foo'))
      },
      function () {
        t.fail('should not get here')
      },
    ],
    function () {
      t.fail('should not get here')
    },
    function (er) {
      t.match(er, { message: 'foo' })
      t.end()
    }
  )
})
