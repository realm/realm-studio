# Changelog

All notable changes to this project will be documented in this file.

This project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Release 3.5.0 (2019-03-06)

[Changes since v3.4.0](https://github.com/realm/realm-studio/compare/v3.4.0...v3.5.0)

### Enhancements

- Added an option to open a GraphiQL explorer for a Realm. The button is located in the bottom of the sidebar menu when you click on a Realm. ([#496](https://github.com/realm/realm-studio/issues/496))

### Fixed

- None

### Internals

- Pinning the WebPack version to 4.28.4 until [https://github.com/webpack/webpack/issues/8656](https://github.com/webpack/webpack/issues/8656) gets resolved + rebuilding the package-lock.json ([#1122](https://github.com/realm/realm-studio/issues/1122))

## Release 3.4.0 (2019-02-21)

[Changes since v3.3.0](https://github.com/realm/realm-studio/compare/v3.3.0...v3.4.0)

### Enhancements

- Added visual feedback when a query in the Realm Browser fails to parse. ([#1100](https://github.com/realm/realm-studio/pull/1100))

### Fixed

- Fixed clicking "Open in Studio" on the Realm Cloud frontend, no longer yields an error. ([#1098](https://github.com/realm/realm-studio/pull/1098), since v3.1.3)
- Fixed selecting objects while filtering or sorting the list of objects. ([1099](https://github.com/realm/realm-studio/pull/1099), since v2.1.1)
- Fixed resizing columns in the Realm Browser. ([#1108](https://github.com/realm/realm-studio/issues/1108), since v3.1.0)

### Internals

- Added a post-package test to ensure auto-updating functions. ([#1095](https://github.com/realm/realm-studio/pull/1095))
- Updated all dependencies, including Electron to v4 and Realm JS to v2.23.0. ([#1095](https://github.com/realm/realm-studio/pull/1095))
- Added a segfault handler which produces a stack trace when a segmentation fault occurs. ([#1082](https://github.com/realm/realm-studio/pull/1082))

## Release 3.3.0 (2019-01-07)

[Changes since v3.2.0](https://github.com/realm/realm-studio/compare/v3.2.0...v3.3.0)

### Enhancements

- Added in-app messages from Realm to the Greeting window. ([#1056](https://github.com/realm/realm-studio/pull/1056))
- Error dialogs now clearly separates the failed intent and the message from the throw exception. ([#1061](https://github.com/realm/realm-studio/pull/1061))

### Fixed

- Fixed text rendering issue resulting in clipping of property name and types in the header of the browser window. It was only observed on Windows with high pixel density displays. ([#1059](https://github.com/realm/realm-studio/pull/1059), since v1.0.0)
- Fixed an issue where sidebars got resized when a window got resized despite the sidebar being collapsed. ([#1060](https://github.com/realm/realm-studio/pull/1060), since v2.7.0)
- Fixed potential issues from writing to partial Realms by opening them in a read-only mode. ([#1062](https://github.com/realm/realm-studio/pull/1062) & [#1063](https://github.com/realm/realm-studio/pull/1063), since v1.0.0)
- Fixed the error shown when connecting to a Realm Cloud instance with an expired token. ([#1067](https://github.com/realm/realm-studio/pull/1067), since v1.18.1)

### Internals

- Fixed the Dockerfile used when testing PRs. ([#1057](https://github.com/realm/realm-studio/pull/1057))
- Removing all existing and future unused locals. ([#1058](https://github.com/realm/realm-studio/pull/1058))
- Refactored singleton windows. ([#1066](https://github.com/realm/realm-studio/pull/1066))
- Refactored the Jenkins CI pipeline. ([#1069](https://github.com/realm/realm-studio/pull/1069) & [#1073](https://github.com/realm/realm-studio/pull/1073))

## Release 3.2.0 (2018-12-21)

[Changes since v3.1.3](https://github.com/realm/realm-studio/compare/v3.1.3...v3.2.0)

This version of Studio changes how Realm state and file size metrics (displayed in the server administration window) are fetched from the server. Consequently server must be at least version 3.16.0 to display these sizes correctly.

### Enhancements

- Showing connection state (disconnected, connecting or connected) in the server administration window. ([#1028](https://github.com/realm/realm-studio/pull/1028))
- No longer waiting for the entire admin Realm to download before showing realms and users in the server administration window. ([#1028](https://github.com/realm/realm-studio/pull/1028))

### Fixed

- Fixed displaying Realm state and file size in the server administration window. ([#1028](https://github.com/realm/realm-studio/pull/1028))
- Fixed process directory creation on initial startup. ([#1054](https://github.com/realm/realm-studio/pull/1054), since v3.1.2)

### Internals

- None

## Release 3.1.3 (2018-12-17)

[Changes since v3.1.2](https://github.com/realm/realm-studio/compare/v3.1.2...v3.1.3)

### Enhancements

- None

### Fixed

- Fixed connecting to a server using an admin token (again²). ([#1050](https://github.com/realm/realm-studio/pull/1050), since v3.0.0)

### Internals

- Removed all use of Realm JS from the main process. ([#1049](https://github.com/realm/realm-studio/pull/1049))
- Upgraded Realm JS to v2.21.1. ([#1050](https://github.com/realm/realm-studio/pull/1050))

## Release 3.1.2 (2018-12-11)

This version had a regression running on Windows and was therefore never released.

[Changes since v3.1.1](https://github.com/realm/realm-studio/compare/v3.1.1...v3.1.2)

### Enhancements

- None

### Fixed

- Fixed connecting to a server using an admin token (again). ([#1038](https://github.com/realm/realm-studio/pull/1038), since v3.0.0)

### Internals

- None

## Release 3.1.1 (2018-12-07)

[Changes since v3.1.0](https://github.com/realm/realm-studio/compare/v3.1.0...v3.1.1)

### Enhancements

- None

### Fixed

- Fixed focussing classes with a missing object in the `__Class` table. It would show "Permissions for [name] class is missing". ([#1037](https://github.com/realm/realm-studio/pull/1037), since 3.1.0)

### Internals

- None

## Release 3.1.0 (2018-12-07)

[Changes since v3.0.7](https://github.com/realm/realm-studio/compare/v3.0.7...v3.1.0)

### Enhancements

- When browsing a reference Realm a permission sidebar appears in the browser. ([#946](https://github.com/realm/realm-studio/pull/946))

### Fixed

- Fixed missing padding in the Realm browsers sidebar when a schema was missing. ([#1026](https://github.com/realm/realm-studio/pull/1026))

### Internals

- Excluding the unpackaged directories when uploading to S3 (again). ([#1013](https://github.com/realm/realm-studio/pull/1013))
- Updated the message in the greeting window to include a button for signing up for the Realm Cloud. ([#1032](https://github.com/realm/realm-studio/pull/1032) and [#1035](https://github.com/realm/realm-studio/pull/1035))

## Release 3.0.7 (2018-11-16)

[Changes since v3.0.6](https://github.com/realm/realm-studio/compare/v3.0.6...v3.0.7)

### Enhancements

- None

### Fixed

- Fixed the automatic updating, which was was broken on Windows. ([#1004](https://github.com/realm/realm-studio/pull/1004))
- Fixed choosing a PM timestamp when creating an object with a datetime value. ([#1005](https://github.com/realm/realm-studio/pull/1005))
- Fixed adding a property when class had many properties and no objects. ([#1008](https://github.com/realm/realm-studio/pull/1008))
- Fixed scrolling the modal dialog after adding an object to list when creating objects. ([#1009](https://github.com/realm/realm-studio/pull/1009))
- Fixed the application menu, which was not updated until the user refocussed the window. ([#1011](https://github.com/realm/realm-studio/pull/1011))

### Internal

- Cleaned up the package.json by using semver instead of compare-versions and moved types to devDependencies. ([#1010](https://github.com/realm/realm-studio/pull/1010))
- Excluding the unpackaged directories when uploading to S3. ([#1012](https://github.com/realm/realm-studio/pull/1012))
- realm-js analytics have been disabled on the main process (similar to what we do for the renderer). ([#994](https://github.com/realm/realm-studio/issues/994))

## Release 3.0.6 (2018-11-14)

[Changes since v3.0.5](https://github.com/realm/realm-studio/compare/v3.0.5...v3.0.6)

### Enhancements

- None

### Fixed

- Windows are no longer rendering blank when connecting to a server on the Windows OS. ([#998](https://github.com/realm/realm-studio/pull/998))

### Internal

- Updated Webpack and dependant modules. ([#999](https://github.com/realm/realm-studio/pull/999))
- Updated TS-lint, Prettier and fixed linting errors. ([#1000](https://github.com/realm/realm-studio/pull/1000))

## Release 3.0.5 (2018-11-13)

[Changes since v3.0.4](https://github.com/realm/realm-studio/compare/v3.0.4...v3.0.5)

### Enhancements

- None

### Fixed

- Fixed the getting started scene of the server administration window, which was missing a button for the React Native quick start guide and the iOS and Android URLs was rendering 404 errors. ([#963](https://github.com/realm/realm-studio/pull/963))
- Fixed not showing the path-level permissions of a reference or partial Realm. ([#989](https://github.com/realm/realm-studio/pull/989))
- Fixed Windows getting smaller on the Windows OS each time the window was opened. ([#991](https://github.com/realm/realm-studio/pull/991))

### Internal

- Updated the changelog and releasenotes. ([#988](https://github.com/realm/realm-studio/pull/988))
- Upgraded to Electron 3.0 + dependencies ([#935](https://github.com/realm/realm-studio/pull/935))

## Release 3.0.4 (2018-11-12)

[Changes since v3.0.3](https://github.com/realm/realm-studio/compare/v3.0.3...v3.0.4)

### Enhancements

- None

### Fixed

- Fixed a crash when sorting a column with type list. ([#984](https://github.com/realm/realm-studio/pull/984))

### Internal

- Moved sentry id to the title and using the bug template for the body. ([#983](https://github.com/realm/realm-studio/pull/983))
- Automated building up release notes in this file as PRs are merged. ([#987](https://github.com/realm/realm-studio/pull/987))

---

The project didn't use to have a CHANGELOG.md.

The notes for previous releases can be found on GitHub: https://github.com/realm/realm-studio/releases
