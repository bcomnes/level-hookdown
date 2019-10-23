# level-hookdown change log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## 3.1.2

* Fix a few issues with returned promises. (https://github.com/hypermodules/level-hookdown/pull/31)

## 3.1.1

* Update outdated dependencies

## 3.1.0

* Add promise support (https://github.com/hypermodules/level-hookdown/pull/28)

## 3.0.0

* Update all deps
  * Levelup 4.1.0

## 2.0.1

* Removed abstract leveldown.  not needed

## 2.0.0

#### Breaking

- level-hookdown now mutates the wrapped level.  It does this in a correct and conventional way however, using prototype method override on the instance object.  The methods `get`, `del`, and `batch` are added to the instance, and internally call the instance prototype methods between pre and post hooks.
- Some of the leveldown baggage has been removed.
- Most of the API is the same.
- A `protectHook` option is added to preserve the batch object if the wrapped `level` mutates that object during its operation.  Levels like `subleveldown` do this.

#### Added

* added some new tests to cover concurrency options

#### Changed

* minor readme improvements

## 1.0.0

* engage
* Initial release
