var util = require('util')
var abstract = require('abstract-leveldown')
var wrap = require('level-option-wrap')

var END = new Buffer([0xff])

function HookDown (db, opts) {
  if (!(this instanceof HookDown)) return new HookDown(db, opts)
  if (!opts) opts = {}

  this.prehooks = []
  this.posthooks = []

  this.db = db
  this.leveldown = null
  this._beforeOpen = opts.open
  this.type = db.type || 'hookdown'

  this._wrap = {
    gt: function (x) {
      return x || ''
    },
    lt: function (x) {
      if (Buffer.isBuffer(x) && !x.length) x = END
      return x || '\xff'
    }
  }

  abstract.AbstractLevelDOWN.call(this, 'no-location')
}

util.inherits(HookDown, abstract.AbstractLevelDOWN)

HookDown.prototype._open = function (opts, cb) {
  var self = this

  if (this.db.isOpen()) {
    if (this.db.db.type === 'subdown' && this.db.db.prefix) {
      this.leveldown = this.db.db.leveldown
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

HookDown.prototype.close = function () {
  console.log('close')
  this.leveldown.close.apply(this.leveldown, arguments)
}

HookDown.prototype.setDb = function () {
  console.log('setDB')
  this.leveldown.setDb.apply(this.leveldown, arguments)
}

HookDown.prototype.put = function (key, value, opts, cb) {
  console.log('put')
  this.leveldown.put(key, value, opts, cb)
}

HookDown.prototype.get = function (key, opts, cb) {
  console.log('get')
  this.leveldown.get(key, opts, cb)
}

HookDown.prototype.del = function (key, opts, cb) {
  console.log('del')
  this.leveldown.del(key, opts, cb)
}

HookDown.prototype.batch =
HookDown.prototype._batch = function (operations, opts, cb) {
  if (arguments.length === 0) return new abstract.AbstractChainedBatch(this)
  if (!Array.isArray(operations)) return this.leveldown.batch.apply(null, arguments)
  console.log('batch')
  this.leveldown.batch(operations, opts, cb)
}

HookDown.prototype.approximateSize = function (start, end, cb) {
  this.leveldown.approximateSize.apply(this.leveldown, arguments)
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

var extend = function (xopts, opts) {
  xopts.keys = opts.keys
  xopts.values = opts.values
  xopts.createIfMissing = opts.createIfMissing
  xopts.errorIfExists = opts.errorIfExists
  xopts.keyEncoding = opts.keyEncoding
  xopts.valueEncoding = opts.valueEncoding
  xopts.compression = opts.compression
  xopts.db = opts.db
  xopts.limit = opts.limit
  xopts.keyAsBuffer = opts.keyAsBuffer
  xopts.valueAsBuffer = opts.valueAsBuffer
  xopts.reverse = opts.reverse
  return xopts
}

var fixRange = function (opts) {
  return (!opts.reverse || (!opts.end && !opts.start)) ? opts : {start: opts.end, end: opts.start}
}

HookDown.prototype.iterator = function (opts) {
  if (!opts) opts = {}
  var xopts = extend(wrap(fixRange(opts), this._wrap), opts)
  return this.leveldown.iterator(xopts)
}

module.exports = HookDown
