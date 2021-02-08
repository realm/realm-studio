# Dependencies

This document will describe known limitations on the dependencies, specifically why some of the packages are not
upgraded to the latest current versions:

## Webpack

We're using `mochapack` (a fork of `mocha-webpack`) to run our tests (enabling importing stylesheets, images, etc) and [this doesn't yet support WebPack v5](https://github.com/sysgears/mochapack/issues/82).

## [sass-loader](https://www.npmjs.com/package/sass-loader)

Pinned at v10 since v11 introduce [this breaking change](https://github.com/webpack-contrib/sass-loader/blob/master/CHANGELOG.md#-breaking-changes):

> minimum supported webpack version is 5

We can unpin this when `mochapack` supports WebPack v5.
