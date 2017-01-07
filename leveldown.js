var util = require('util')
var abstract = require('abstract-leveldown')
var runTypes = {
  series: require('run-series'),
  parallel: require('run-parallel'),
  limit: require('run-parallel-limit')
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

function HookDown (db, opts) {
  if (!(this instanceof HookDown)) return new HookDown(db, opts)
  if (!opts) opts = {}

  this.prehooks = []
  this.posthooks = []

  this.db = db
  this.leveldown = null
  this.prefix = null
  this.type = db.type || 'hookdown'
  this._beforeOpen = opts.open
  this._runner = makeRunner(opts.type || 'parallel', opts.limit || 5)

  abstract.AbstractLevelDOWN.call(this, 'no-location')
}

util.inherits(HookDown, abstract.AbstractLevelDOWN)

HookDown.prototype._open = function (opts, cb) {
  var self = this

  if (this.db.isOpen()) {
    if (this.db.db.type === 'subdown' && this.db.db.prefix) {
      this.leveldown = this.db.db.leveldown
      this.prefix = this.db.db.prefix
    } else {
      this.leveldown = this.db.db
    }
    return done()
  }

  this.db.on('open', this.open.bind(this, opts, done))

  function done (err) {
    if (err || !self._beforeOpen) return cb(err)
    self._beforeOpen(cb)
  }
}

HookDown.prototype._close = function (cb) {
  this.leveldown.close.apply(this.leveldown, arguments)
}

HookDown.prototype._get = function (key, opts, cb) {
  this.leveldown.get(key, opts, cb)
}

HookDown.prototype._put = function (key, value, opts, cb) {
  var self = this
  var preWork = this.prehooks.map(function (hook) {
    return hook.bind(hook, { type: 'put', key: key, value: value, opts: opts })
  })

  this._runner(preWork, preCb)

  function preCb (err) {
    if (err) return cb(err)
    self.leveldown.put(key, value, opts, postCb)
  }

  function postCb (err) {
    if (err) return cb(err)
    var postWork = self.posthooks.map(function (hook) {
      return hook.bind(hook, { type: 'put', key: key, value: value, opts: opts })
    })
    self._runner(postWork, function (err) {
      cb(err)
    })
  }
}

HookDown.prototype._batch = function (operations, opts, cb) {
  if (arguments.length === 0) return new abstract.AbstractChainedBatch(this)

  var self = this
  var preWork = this.prehooks.map(function (hook) {
    return hook.bind(hook, { type: 'batch', array: operations, opts: opts })
  })

  this._runner(preWork, preCb)

  function preCb (err) {
    if (err) return cb(err)
    if (!Array.isArray(operations)) return this.leveldown.batch.apply(null, operations, opts, postCb)
    self.leveldown.batch(operations, opts, postCb)
  }

  function postCb (err) {
    if (err) return cb(err)
    var postWork = self.posthooks.map(function (hook) {
      return hook.bind(hook, { type: 'batch', array: operations, opts: opts })
    })
    self._runner(postWork, function (err) {
      cb(err)
    })
  }
}

HookDown.prototype._del = function (key, opts, cb) {
  var self = this
  var preWork = this.prehooks.map(function (hook) {
    return hook.bind(hook, { type: 'del', key: key }, opts)
  })
  this._runner(preWork, preCb)

  function preCb (err) {
    if (err) return cb(err)
    self.leveldown.del(key, opts, postCb)
  }

  function postCb (err) {
    if (err) return cb(err)
    var postWork = self.posthooks.map(function (hook) {
      return hook.bind(hook, { type: 'del', key: key }, opts)
    })
    self._runner(postWork, function (err) {
      cb(err)
    })
  }
}

HookDown.prototype._iterator = function (opts) {
  return this.leveldown.iterator(opts)
}

HookDown.prototype._approximateSize = function (start, end, cb) {
  this.leveldown.approximateSize.apply(this.leveldown, arguments)
}

HookDown.prototype.setDb = function () {
  this.leveldown.setDb.apply(this.leveldown, arguments)
}

HookDown.prototype.getProperty = function () {
  return this.leveldown.getProperty.apply(this.leveldown, arguments)
}

HookDown.prototype.destroy = function () {
  return this.leveldown.destroy.apply(this.leveldown, arguments)
}

HookDown.prototype.repair = function () {
  return this.leveldown.repair.apply(this.leveldown, arguments)
}

module.exports = HookDown
