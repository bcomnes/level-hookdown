var hookdown = require('./leveldown')
var levelup = require('levelup')

module.exports = function (db, prefix, opts) {
  if (typeof prefix === 'object' && !opts) return module.exports(db, null, prefix)
  if (!opts) opts = {}

  opts.db = function () {
    return hookdown(db, prefix, opts)
  }

  return levelup(opts)
}
