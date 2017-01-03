var memdb = require('memdb')
var sub = require('subleveldown')
var hookdown = require('../leveldown')
var test = require('tape')
var testCommon = require('./common')
var testBuffer = new Buffer('this-is-test-data')

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

