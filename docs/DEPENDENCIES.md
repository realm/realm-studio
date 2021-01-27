# Dependencies

This document will describe known limitations on the dependencies, specifically why some of the packages are not
upgraded to the latest current versions:

## Webpack

We're using `mochapack` (a fork of `mocha-webpack`) to run our tests (enabling importing stylesheets, images, etc) and [this doesn't yet support WebPack v5](https://github.com/sysgears/mochapack/issues/82).

## `@types/webdriverio`

Pinned at version 4.13.3, because we only need the types and the latest version (5.0.0) removes them.
