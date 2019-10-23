var runTypes = {
  series: require('run-series'),
  parallel: require('run-parallel'),
  limit: require('run-parallel-limit')
}
var getPrototypeOf = Object.getPrototypeOf
var extend = require('xtend')

module.exports = hook

function hook (db, opts) {
  if (!opts) opts = {}

  if (Object.prototype.hasOwnProperty.call(db, 'put')) throw (new Error('Can\'t hook: put method already set on instance'))
  if (Object.prototype.hasOwnProperty.call(db, 'del')) throw (new Error('Can\'t hook: del method already set on instance'))
  if (Object.prototype.hasOwnProperty.call(db, 'batch')) throw (new Error('Can\'t hook: batch method already set on instance'))
  db.prehooks = []
  db.posthooks = []
  db._hookRunner = makeRunner(opts.type || 'parallel', opts.limit || 5)
  db._protectHook = opts.protectHook || false
  db.put = put
  db.batch = batch
  db.del = del
  return db
}

function makeRunner (type, limit) {
  if (type === 'limit') {
    return function plimit (work, callback) {
      runTypes.limit(work, limit, callback)
    }
  } else {
    return runTypes[type]
  }
}

function put (key, value, opts, cb) {
  cb = getCallback(opts, cb)
  if (!cb) {
    cb = createPromiseCb()
  }
  opts = getOptions(opts)

  var self = this
  var protoPut = getPrototypeOf(self).put.bind(this)
  var preWork = this.prehooks.map(function (hook) {
    return hook.bind(hook, { type: 'put', key: key, value: value, opts: opts })
  })

  this._hookRunner(preWork, preCb)

  return cb.promise

  function preCb (err) {
    if (err) return cb(err)
    protoPut(key, value, opts, postCb)
  }

  function postCb (err) {
    if (err) return cb(err)
    var postWork = self.posthooks.map(function (hook) {
      return hook.bind(hook, { type: 'put', key: key, value: value, opts: opts })
    })
    self._hookRunner(postWork, function (err) {
      cb(err)
    })
  }
}

module.exports.put = put

function del (key, opts, cb) {
  cb = getCallback(opts, cb)
  if (!cb) {
    cb = createPromiseCb()
  }
  opts = getOptions(opts)

  var self = this
  var protoDel = getPrototypeOf(self).del.bind(this)
  var preWork = this.prehooks.map(function (hook) {
    return hook.bind(hook, { type: 'del', key: key, opts: opts })
  })
  this._hookRunner(preWork, preCb)

  return cb.promise

  function preCb (err) {
    if (err) return cb(err)
    protoDel(key, opts, postCb)
  }

  function postCb (err) {
    if (err) return cb(err)
    var postWork = self.posthooks.map(function (hook) {
      return hook.bind(hook, { type: 'del', key: key, opts: opts })
    })
    self._hookRunner(postWork, function (err) {
      cb(err)
    })
  }
}

module.exports.del = del

function batch (operations, opts, cb) {
  cb = getCallback(opts, cb)
  if (!cb) {
    cb = createPromiseCb()
  }
  opts = getOptions(opts)

  var self = this
  var protoBatch = getPrototypeOf(self).batch.bind(this)
  var oper = operations.slice()
  var hookOperations = this._protectHook ? operations.map(copyArrayObj) : operations
  var preWork = this.prehooks.map(function (hook) {
    return hook.bind(hook, { type: 'batch', array: hookOperations, opts: opts })
  })

  this._hookRunner(preWork, preCb)

  return cb.promise

  function preCb (err) {
    if (err) return cb(err)
    if (!Array.isArray(operations)) return this.leveldown.batch.apply(null, operations, opts, postCb)
    protoBatch(oper, opts, postCb)
  }

  function postCb (err) {
    if (err) return cb(err)
    var postWork = self.posthooks.map(function (hook) {
      return hook.bind(hook, { type: 'batch', array: hookOperations, opts: opts })
    })
    self._hookRunner(postWork, function (err) {
      cb(err)
    })
  }
}

module.exports.batch = batch

function copyArrayObj (obj) {
  return extend(obj)
}

// These are levelup utility functions

function getCallback (options, callback) {
  return typeof options === 'function' ? options : callback
}

function getOptions (options) {
  if (typeof options === 'string') {
    options = { valueEncoding: options }
  }
  if (typeof options !== 'object') {
    options = {}
  }
  return options
}

function createPromiseCb () {
  let callback

  const promise = new Promise((resolve, reject) => {
    callback = (err, ...rest) => {
      if (err) reject(err)
      else resolve(...rest)
    }
  })

  callback.promise = promise
  return callback
}
