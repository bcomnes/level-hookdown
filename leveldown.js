var util = require('util')
var abstract = require('abstract-leveldown')

function HookDown (db, opts) {
  if (!(this instanceof HookDown)) return new HookDown(db, opts)
  if (!opts) opts = {}

  this.prehooks = []
  this.posthooks = []

  this.db = db
  this.leveldown = null
  this.prefix = null
  this._beforeOpen = opts.open
  this.type = db.type || 'hookdown'

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

HookDown.prototype._close = function () {
  this.leveldown.close.apply(this.leveldown, arguments)
}

HookDown.prototype._put = function (key, value, opts, cb) {
  this.leveldown.put(key, value, opts, cb)
}

HookDown.prototype._get = function (key, opts, cb) {
  this.leveldown.get(key, opts, cb)
}

HookDown.prototype._del = function (key, opts, cb) {
  this.leveldown.del(key, opts, cb)
}

HookDown.prototype._batch = function (operations, opts, cb) {
  if (arguments.length === 0) return new abstract.AbstractChainedBatch(this)
  if (!Array.isArray(operations)) return this.leveldown.batch.apply(null, arguments)
  this.leveldown.batch(operations, opts, cb)
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
