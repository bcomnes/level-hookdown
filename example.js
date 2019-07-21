var hook = require('./')
var MemDB = require('memdb')
var sub = require('sublevel')
var db = hook(sub(MemDB(), 'test', { valueEncoding: 'json' }), { protectHook: true })

function prehook (operation, cb) {
  console.log('this should run before the db operation')
  console.log(operation)
  cb()
}

function posthook (operation, cb) {
  console.log('this should run after the db operation')
  console.log(operation)
  cb()
}

db.prehooks.push(prehook)
db.posthooks.push(posthook)

db.put('beep', 'boop', function (err) {
  if (err) throw err
  db.del('beep', function (err) {
    if (err) throw err
    db.batch([
      { type: 'put', key: 'gleep', value: 'gloop' },
      { type: 'put', key: 'bleep', value: 'bloop' }
    ], function (err) {
      if (err) throw err
      db.get('bleep', function (err, value) {
        if (err) throw err
        console.log(value)
        console.log('done')
      })
    })
  })
})
