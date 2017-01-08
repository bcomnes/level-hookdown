var tape = require('tape')
var hook = require('../')
var MemDB = require('memdb')

tape('test level-hookdown', function (t) {
  var mdb = MemDB()
  var db = hook(mdb)
  t.plan(7)

  db.prehooks.push(prehook)
  db.posthooks.push(posthook)

  db.put('main', 'mainmain', function (err) {
    t.error(err, 'put on wrapped db is error free')
  })

  function prehook (operation, cb) {
    mdb.put('pre', 'prepre', function (err) {
      t.error(err, 'put in prehook is error free')
      if (err) return cb(err)
      db.get('main', function (err, value) {
        t.equal(err.type, 'NotFoundError', 'main operation hasnt been performed in prehook')
        cb(err.type !== 'NotFoundError' ? err : null)
      })
    })
  }

  function posthook (operation, cb) {
    db.get('pre', function (err, value) {
      t.error(err)
      if (err) return cb(err)
      t.equal(value, 'prepre', 'prehook put worked fine')
      db.get('main', function (err, value) {
        t.error(err)
        if (err) return cb(err)
        t.equal(value, 'mainmain', 'main put worked fine')
        cb()
      })
    })
  }
})

tape('test level-hookdown series', function (t) {
  var mdb = MemDB()
  var db = hook(mdb, {
    type: 'series'
  })
  t.plan(7)

  db.prehooks.push(prehook)
  db.posthooks.push(posthook)

  db.put('main', 'mainmain', function (err) {
    t.error(err, 'put on wrapped db is error free')
  })

  function prehook (operation, cb) {
    mdb.put('pre', 'prepre', function (err) {
      t.error(err, 'put in prehook is error free')
      if (err) return cb(err)
      db.get('main', function (err, value) {
        t.equal(err.type, 'NotFoundError', 'main operation hasnt been performed in prehook')
        cb(err.type !== 'NotFoundError' ? err : null)
      })
    })
  }

  function posthook (operation, cb) {
    db.get('pre', function (err, value) {
      t.error(err)
      if (err) return cb(err)
      t.equal(value, 'prepre', 'prehook put worked fine')
      db.get('main', function (err, value) {
        t.error(err)
        if (err) return cb(err)
        t.equal(value, 'mainmain', 'main put worked fine')
        cb()
      })
    })
  }
})

tape('test level-hookdown limit', function (t) {
  var mdb = MemDB()
  var db = hook(mdb, {
    type: 'limit'
  })
  t.plan(7)

  db.prehooks.push(prehook)
  db.posthooks.push(posthook)

  db.put('main', 'mainmain', function (err) {
    t.error(err, 'put on wrapped db is error free')
  })

  function prehook (operation, cb) {
    mdb.put('pre', 'prepre', function (err) {
      t.error(err, 'put in prehook is error free')
      if (err) return cb(err)
      db.get('main', function (err, value) {
        t.equal(err.type, 'NotFoundError', 'main operation hasnt been performed in prehook')
        cb(err.type !== 'NotFoundError' ? err : null)
      })
    })
  }

  function posthook (operation, cb) {
    db.get('pre', function (err, value) {
      t.error(err)
      if (err) return cb(err)
      t.equal(value, 'prepre', 'prehook put worked fine')
      db.get('main', function (err, value) {
        t.error(err)
        if (err) return cb(err)
        t.equal(value, 'mainmain', 'main put worked fine')
        cb()
      })
    })
  }
})
