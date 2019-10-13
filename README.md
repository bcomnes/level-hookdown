# level-hookdown

Simple levelup hooks implemented using instance method override of arbitrary levelups.

```
npm install level-hookdown
```

[![level badge][level-badge]](https://github.com/level/awesome)
[![npm][npm-image]][npm-url]
[![Build Status](https://travis-ci.org/hypermodules/level-hookdown.svg?branch=master)](https://travis-ci.org/hypermodules/level-hookdown)
[![dependencies Status](https://david-dm.org/hypermodules/level-hookdown/status.svg)](https://david-dm.org/hypermodules/level-hookdown)
[![devDependencies Status](https://david-dm.org/hypermodules/level-hookdown/dev-status.svg)](https://david-dm.org/hypermodules/level-hookdown?type=dev)

<img height="100" src="hook.png">

[level-badge]: https://camo.githubusercontent.com/1bd15320a5fad1db168bba8bcedb098735f82464/68747470733a2f2f6c6576656c6a732e6f72672f696d672f62616467652e737667
[npm-image]: https://img.shields.io/npm/v/level-hookdown.svg
[npm-url]: https://www.npmjs.com/package/level-hookdown

## Usage

```js
var hook = require('level-hookdown')
var mem = require('level-mem')  // or 'level' or other levelup factory
var mdb = mem()
var db = hook(mdb)

function prehook (operation, cb) {
  console.log('this should run before the db operation')
  console.log(operation)
  cb()
}

function posthook (operation, cb) {
  console.log('this should run after the db operation')
  console.log(operation)
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

```

## API

#### `hookdb = hook(db, [options])`

Returns a levelup instance that executes a series of pre and post hook functions before `put`, `del`, and `batch` method calls.  Composes well with [mafintosh/subleveldown](https://github.com/mafintosh/subleveldown). Conflicts with [dominictarr/level-sublevel](https://github.com/dominictarr/level-sublevel).

The following `options` can be set when wrapping a `level` with `hook`:

```js
{
  type: 'parallel' | 'series' | 'limit',
  limit: 5,
  protectHook: false
}
```

- The `type` determines if the hook functions are run in series, parallel or parallel-limit.  Default is `parallel`.
- The limit option is passed to `run-parallel-limit` when `type` is set to `limit`.  The default is 5.
- `protectHook` performs a deep copy on the operation array in batches to preserve values if the levelup mutates them (like `subleveldown` does).

### Hooks

#### `hookdb.prehooks`

An array of hook functions that are run before `put`, `del`, and `batch` method calls to the `hookdb` instance.  If a hook function in the prehook array returns an `err` object to its callback, the originating `put`, `del` or `batch` operation will not be run on the contained `db` that `hookdb` is wrapping.  A prehook veto convetion could be built on top of this behavior via error handling and retry.

#### `hookdb.posthooks`

An array of functions that are run after sucessful `put`, `del`, and `batch` method calls on the wrapped `db` instance inside a `hookdb` instance.

#### `hookFn(operation, callback)`

Hook functions receive an `operation` object that describes the level operation and a `callback` function.

`hookdb.prehooks` and `hookdb.posthooks` are arrays that you can add, rearrange, and delete hook functions from using standard array methods like `hookdb.prehooks.push(fn)` and `hookdb.posthooks.pop(fn)`.

##### `operation`

The `operation` argument can contain an object that looks like:

- `{type:'put', key: 'key', value: 'value', opts}`
- `{type: 'del', key: 'key', opts}`
- `{type: 'batch', array: [operationArray], opts}`

The `opts` object in the level operation object are the options that get passed through to the wrapped level.

## See Also

- [hypermodules/level-auto-index](https://github.com/hypermodules/level-auto-index) - Automatic secondary indexing for leveldb and subleveldown leveraging `level-hookdown`.
- [hypermodules/level-idx](https://github.com/hypermodules/level-idx) - Another high-level API for creating secondary leveldb indexes using `level-auto-index` and `level-hookdown`.

This module is basically an alternative implementation of:

- [dominictarr/level-hooks](https://github.com/dominictarr/level-hooks)

but aimed at a subleveldown workflow. These were also influential:

- [dominictarr/level-post](https://github.com/dominictarr/level-post)
- [dominictarr/level-sublevel](https://github.com/dominictarr/level-sublevel)
