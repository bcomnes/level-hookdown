var hookdown = require('./leveldown')
var levelup = require('levelup')
var extend = require('xtend')

module.exports = function (db, opts) {
  if (!opts) opts = {}
  opts = extend(db.options, opts)
  var hdown = hookdown(db, opts)
  opts.db = function () {
    return hdown
  }

  var lup = levelup(opts)
  lup.prehooks = hdown.prehooks
  lup.posthooks = hdown.posthooks
  return lup
}
