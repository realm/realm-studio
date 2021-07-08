# Dependencies

This document will describe known limitations on the dependencies, specifically why some of the packages are not upgraded to the latest current versions:

## Electron (and spectron)

We're on Electron v11 and consequently spectron v13.

Upgrading introduce a couple of breaking changes that require attention:
- [v12 breaking changes](https://www.electronjs.org/releases/stable?version=12&page=3#breaking-changes-1200)
- [v13 breaking changes](https://www.electronjs.org/releases/stable?version=13&page=2#breaking-changes-1300)

## Bootstrap

The components of the project was built around Bootstrap v4.

Instead of upgrading to v5 we'll probably adopt [the MongoDB design system](https://www.mongodb.design/).
