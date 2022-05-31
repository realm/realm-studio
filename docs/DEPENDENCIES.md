# Dependencies

This document will describe known limitations on the dependencies, specifically why some of the packages are not upgraded to the latest current versions:

## Electron (and spectron)

We're on Electron v11 and consequently spectron v13.

Upgrading introduce a couple of breaking changes that require attention:
- [v12 breaking changes](https://www.electronjs.org/releases/stable?version=12&page=3#breaking-changes-1200)
- [v13 breaking changes](https://www.electronjs.org/releases/stable?version=13&page=2#breaking-changes-1300)

## React & React DOM

We're keeping the `react` and `react-dom` packages on v17 until `react-virtualized` gets released with support for React v18: https://github.com/bvaughn/react-virtualized/issues/1746
