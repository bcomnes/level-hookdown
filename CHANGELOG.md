# level-hookdown change log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## Unreleased

* added some new tests to cover concurrency options
* minor readme improvements

## 2.0.0

#### Breaking

- level-hookdown now mutates the wrapped level.  It does this in a correct and conventional way however, using prototype method override on the instance object.  The methods `get`, `del`, and `batch` are added to the instance, and internally call the instance prototype methods between pre and post hooks.
- Some of the leveldown baggage has been removed.
- Most of the API is the same.
- A `protectHook` option is added to preserve the batch object if the wrapped `level` mutates that object during its operation.  Levels like `subleveldown` do this.

## 1.0.0

* engage
* Initial release
