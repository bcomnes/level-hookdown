var test = require('tape')
var hookdown = require('../leveldown')
var sub = require('subleveldown')
var levelup = require('levelup')
var memdown = require('memdown')
var memdb = require('memdb')
var testCommon = require('./common')
var testBuffer = new Buffer('this-is-test-data')

require('abstract-leveldown/abstract/open-test').args(down, test, testCommon)
require('abstract-leveldown/abstract/open-test').open(down, test, testCommon)
require('abstract-leveldown/abstract/del-test').all(down, test, testCommon)
require('abstract-leveldown/abstract/get-test').all(down, test, testCommon)
require('abstract-leveldown/abstract/put-test').all(down, test, testCommon)
require('abstract-leveldown/abstract/put-get-del-test').all(down, test, testCommon, testBuffer)
require('abstract-leveldown/abstract/batch-test').all(down, test, testCommon)
require('abstract-leveldown/abstract/chained-batch-test').all(down, test, testCommon)
require('abstract-leveldown/abstract/close-test').close(down, test, testCommon)
require('abstract-leveldown/abstract/iterator-test').all(down, test, testCommon)
require('abstract-leveldown/abstract/ranges-test').all(down, test, testCommon)

function down (loc) {
  return hookdown(levelup(loc, {db: memdown}), 'test')
}

require('abstract-leveldown/abstract/open-test').args(subhook, test, testCommon)
require('abstract-leveldown/abstract/open-test').open(subhook, test, testCommon)
require('abstract-leveldown/abstract/del-test').all(subhook, test, testCommon)
require('abstract-leveldown/abstract/get-test').all(subhook, test, testCommon)
require('abstract-leveldown/abstract/put-test').all(subhook, test, testCommon)
require('abstract-leveldown/abstract/put-get-del-test').all(subhook, test, testCommon, testBuffer)
require('abstract-leveldown/abstract/batch-test').all(subhook, test, testCommon)
require('abstract-leveldown/abstract/chained-batch-test').all(subhook, test, testCommon)
require('abstract-leveldown/abstract/close-test').close(subhook, test, testCommon)
require('abstract-leveldown/abstract/iterator-test').all(subhook, test, testCommon)
require('abstract-leveldown/abstract/ranges-test').all(subhook, test, testCommon)

function subhook (loc) {
  var mem = memdb()
  return hookdown(sub(mem, 'test'))
}

