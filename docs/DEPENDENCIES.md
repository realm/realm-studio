# Dependencies

This document will describe known limitations on the dependencies, specifically why some of the packages are not
upgraded to the latest current versions:

## `mocha`

We use `mocha-webpack` to run tests that can load directly from our TS source files (because these may include imports
of stylesheets, images, etc). A new major version (6) of mocha is out, but the newest version of `mocha-webpack`
(2.0.0-beta.0) has a peerDependency on `mocha@>=4 <=5`.

## `@types/webdriverio`

Pinned at version 4.13.3, because we only need the types and the latest version (5.0.0) removes them.
