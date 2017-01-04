var hookdown = require('./leveldown')
var levelup = require('levelup')

module.exports = function (db, opts) {
  if (!opts) opts = {}
  var hdown = hookdown(db, opts)
  opts.db = function () {
    return hdown
  }
  var lup = levelup(opts)
  lup.prehooks = hdown.prehooks
  lup.posthooks = hdown.posthooks
  return lup
}
