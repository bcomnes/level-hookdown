var tape = require('tape')
var hook = require('../')
var mem = require('level-mem')
var sub = require('subleveldown')

tape('test level-hookdown', function (t) {
  var sublevel = sub(mem(), 'test', { valueEncoding: 'json' })
  var db = hook(sublevel)

  t.plan(4)

  db.prehooks.push(prehook)
  db.posthooks.push(posthook)

  var setVal = {
    beep: 'boop'
  }

  db.put('main', setVal, function (err) {
    t.error(err, 'put on wrapped db is error free')
  })

  function prehook (operation, cb) {
    db.get('main', function (err, value) {
      t.equal(err.type, 'NotFoundError', 'main operation hasnt been performed in prehook')
      cb(err.type !== 'NotFoundError' ? err : null)
    })
  }

  function posthook (operation, cb) {
    db.get('main', function (err, value) {
      t.error(err)
      if (err) return cb(err)
      t.deepEqual(value, setVal, 'main put worked fine')
      cb()
    })
  }
})

tape('[promises] test level-hookdown', async function (t) {
  var sublevel = sub(mem(), 'test', { valueEncoding: 'json' })
  var db = hook(sublevel)

  t.plan(4)

  db.prehooks.push(prehook)
  db.posthooks.push(posthook)

  var setVal = {
    beep: 'boop'
  }

  t.doesNotThrow(async function () {
    await db.put('main', setVal)
  }, 'put on wrapped db is error free')

  function prehook (operation, cb) {
    db.get('main', function (err, value) {
      t.equal(err.type, 'NotFoundError', 'main operation hasnt been performed in prehook')
      cb(err.type !== 'NotFoundError' ? err : null)
    })
  }

  function posthook (operation, cb) {
    db.get('main', function (err, value) {
      t.error(err)
      if (err) return cb(err)
      t.deepEqual(value, setVal, 'main put worked fine')
      cb()
    })
  }
})

tape('test level-hookdown series', function (t) {
  var level = mem({ valueEncoding: 'json' })
  var db = hook(level, { type: 'series' })

  t.plan(4)

  db.prehooks.push(prehook)
  db.posthooks.push(posthook)

  var setVal = {
    beep: 'boop'
  }

  db.put('main', setVal, function (err) {
    t.error(err, 'put on wrapped db is error free')
  })

  function prehook (operation, cb) {
    db.get('main', function (err, value) {
      t.equal(err.type, 'NotFoundError', 'main operation hasnt been performed in prehook')
      cb(err.type !== 'NotFoundError' ? err : null)
    })
  }

  function posthook (operation, cb) {
    db.get('main', function (err, value) {
      t.error(err)
      if (err) return cb(err)
      t.deepEqual(value, setVal, 'main put worked fine')
      cb()
    })
  }
})

tape('[promises] test level-hookdown series', function (t) {
  var level = mem({ valueEncoding: 'json' })
  var db = hook(level, { type: 'series' })

  t.plan(4)

  db.prehooks.push(prehook)
  db.posthooks.push(posthook)

  var setVal = {
    beep: 'boop'
  }

  t.doesNotThrow(async function () {
    await db.put('main', setVal)
  }, 'put on wrapped db is error free')

  function prehook (operation, cb) {
    db.get('main', function (err, value) {
      t.equal(err.type, 'NotFoundError', 'main operation hasnt been performed in prehook')
      cb(err.type !== 'NotFoundError' ? err : null)
    })
  }

  function posthook (operation, cb) {
    db.get('main', function (err, value) {
      t.error(err)
      if (err) return cb(err)
      t.deepEqual(value, setVal, 'main put worked fine')
      cb()
    })
  }
})

tape('test level-hookdown limit', function (t) {
  var sublevel = sub(mem(), 'test', { valueEncoding: 'json' })
  var db = hook(sublevel, { type: 'limit', limit: 2 })

  t.plan(4)

  db.prehooks.push(prehook)
  db.posthooks.push(posthook)

  var setVal = {
    beep: 'boop'
  }

  db.put('main', setVal, function (err) {
    t.error(err, 'put on wrapped db is error free')
  })

  function prehook (operation, cb) {
    db.get('main', function (err, value) {
      t.equal(err.type, 'NotFoundError', 'main operation hasnt been performed in prehook')
      cb(err.type !== 'NotFoundError' ? err : null)
    })
  }

  function posthook (operation, cb) {
    db.get('main', function (err, value) {
      t.error(err)
      if (err) return cb(err)
      t.deepEqual(value, setVal, 'main put worked fine')
      setTimeout(cb, 100)
    })
  }
})

tape('[promises] test level-hookdown limit', function (t) {
  var sublevel = sub(mem(), 'test', { valueEncoding: 'json' })
  var db = hook(sublevel, { type: 'limit', limit: 2 })

  t.plan(4)

  db.prehooks.push(prehook)
  db.posthooks.push(posthook)

  var setVal = {
    beep: 'boop'
  }

  t.doesNotThrow(async function () {
    await db.put('main', setVal)
  }, 'put on wrapped db is error free')

  function prehook (operation, cb) {
    db.get('main', function (err, value) {
      t.equal(err.type, 'NotFoundError', 'main operation hasnt been performed in prehook')
      cb(err.type !== 'NotFoundError' ? err : null)
    })
  }

  function posthook (operation, cb) {
    db.get('main', function (err, value) {
      t.error(err)
      if (err) return cb(err)
      t.deepEqual(value, setVal, 'main put worked fine')
      setTimeout(cb, 100)
    })
  }
})
