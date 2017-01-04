var hook = require('./')
var MemDB = require('memdb')
var mdb = MemDB()
var db = hook(mdb)

function prehook (operation, opts, cb) {
  console.log('this should run before the db operation')
  console.log(operation)
  console.log(opts)
  cb()
}

function posthook (operation, opts, cb) {
  console.log('this should run after the db operation')
  console.log(operation)
  console.log(opts)
  cb()
}

db.prehooks.push(prehook)
db.posthooks.push(posthook)

db.put('beep', 'boop', function (err) {
  if (err) throw err
  db.del('beep', function (err) {
    if (err) throw err
    db.batch([
      { type: 'put', key: 'father', value: 'gloop' },
      { type: 'put', key: 'another', value: 'heep' }
    ], function (err) {
      if (err) throw err
      console.log('done')
    })
  })
})
