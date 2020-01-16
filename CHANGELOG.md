# Changelog

All notable changes to this project will be documented in this file.

This project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).


## Release 3.9.0 (2020-01-16)

[Changes since v3.8.3](https://github.com/realm/realm-studio/compare/v3.8.3...v3.9.0)

### Enhancements

- Added a prompt to upgrade (and optionally backup) when opening a Realm file which uses an outdated file format. This disables automatically upgrading local Realm files when opening them. ([#1236](https://github.com/realm/realm-studio/pull/1236))

### Fixed

- Fixed an issue occurring if a Realm had been opened from a server, deleted from the server and reopened in Studio. A local cache of the Realm would exist and instead of discarding the local copy entirely, the schema of the local copy would be written to the realm and uploaded to the server. ([#1238](https://github.com/realm/realm-studio/pull/1238)

### Internals

- None


## Release 3.8.3 (2019-11-26)

[Changes since v3.8.2](https://github.com/realm/realm-studio/compare/v3.8.2...v3.8.3)

### Enhancements

- None

### Fixed

- None

### Internals

- Removed call-to-action and button to upgrade a full Realm to a query-based sync "reference" Realm. ([#1226](https://github.com/realm/realm-studio/pull/1226))
- Upgraded dependencies, including Electron to v4. ([#1174](https://github.com/realm/realm-studio/pull/1174), [#1221](https://github.com/realm/realm-studio/pull/1221) & [#1228](https://github.com/realm/realm-studio/pull/1228))


## Release 3.8.2 (2019-11-12)

[Changes since v3.8.1](https://github.com/realm/realm-studio/compare/v3.8.1...v3.8.2)

### Enhancements

- None

### Fixed

- When saying no to upgrade Studio and restarting Studio, update to the newest version would happen at next start.
This is fixed so you are always asked to confirm download when starting Studio ([#1209](https://github.com/realm/realm-studio/pull/1209), since v0.0.1-alpha.8)
- Now prompting users to download the 3.8.1-ros-3-19-0 compatibility version when connecting to ROS < 3.20.1. ([#1211](https://github.com/realm/realm-studio/pull/1211), since v3.8.0)
- Fixed highlighting rows for editing in a `List`. ([#1216](https://github.com/realm/realm-studio/pull/1216), since v2.9.0)

### Internals

- Switched to using "esModuleInterop", allowing `import Lib from 'lib'` instead of `import * as Lib from 'lib'`. ([#1210](https://github.com/realm/realm-studio/pull/1210))


## Release 3.8.1 (2019-10-18)

[Changes since v3.8.0](https://github.com/realm/realm-studio/compare/v3.8.0...v3.8.1)

### Enhancements

- None

### Fixed

- Fixed error "`XMLHttpRequest` is not defined" when opening a ROS instance from Realm Cloud. ([#1196](https://github.com/realm/realm-studio/pull/1196), since v3.8.0)

### Internals

- Upgraded Realm JS to v3.3.0. ([#1196](https://github.com/realm/realm-studio/pull/1196), since v3.8.0)


## Release 3.8.0 (2019-10-17)

[Changes since v3.7.0](https://github.com/realm/realm-studio/compare/v3.7.0...v3.8.0)

### Enhancements

- Added TypeScript schema exporter ([#1185](https://github.com/realm/realm-studio/pull/1185))

### Fixed

- Fixed displaying object level permissions for the correct object when the table of objects were filtered or sorted. ([#1180](https://github.com/realm/realm-studio/pull/1180))
- Fixed exporting schemas to Java and Kotlin. The @Required annotation was incorrectly applied to lists of non-primitives. ([#1181](https://github.com/realm/realm-studio/pull/1181), since v1.8.0)
- On Windows, ensure there'll be no unnecessary local path collisions when browsing multiple Realm Cloud instances. The effect would have been that Realms with the same name that resided on different servers would need to be redownloaded every time you switched servers. ([#1184](https://github.com/realm/realm-studio/pull/1184), since v3.7.0)
- Fixed displaying fatal errors in the Realm Browser. ([#1189](https://github.com/realm/realm-studio/pull/1189), since v1.0.0-rc.2)
- Fixed URLs of the "getting started" call-to-action buttons on the server administration window. ([#1192](https://github.com/realm/realm-studio/pull/1192))

### Internals

- Upgraded Realm JS to v3.2.0. ([#1177](https://github.com/realm/realm-studio/pull/1177))


## Release 3.7.0 (2019-09-27)

[Changes since v3.6.1](https://github.com/realm/realm-studio/compare/v3.6.1...v3.7.0)

### Enhancements

- Added hashing of the paths that Realms gets downloaded to on Windows. This is to avoid hitting the 260 character limit. ([#1172](https://github.com/realm/realm-studio/pull/1172))
- Added a menu item to "Copy local Realm path" to the users clipboard. ([#1172](https://github.com/realm/realm-studio/pull/1172))

### Fixed

- None

### Internals

- Upgraded a lot of dependencies to their latest versions. ([#1167](https://github.com/realm/realm-studio/pull/1167), [#1169](https://github.com/realm/realm-studio/pull/1169), [#1173](https://github.com/realm/realm-studio/pull/1173), [#1175](https://github.com/realm/realm-studio/pull/1175), [#1176](https://github.com/realm/realm-studio/pull/1176))


## Release 3.6.1 (2019-06-06)

[Changes since v3.5.0](https://github.com/realm/realm-studio/compare/v3.5.0...v3.6.1)

### Enhancements

- Improved how log entries are displayed in the server adminstration window: The timestamp now displays the date when the entry is not from the current day and the context object gets expanded initially. ([#1131](https://github.com/realm/realm-studio/issues/1131), since v1.20.0)
- Added a menu item to export data to JSON or a local Realm from the Realm Browser window. When exporting to a local Realm the file will be compacted and saved without additional free space. ([#1134](https://github.com/realm/realm-studio/pull/1134))
- Added an option to run verbatim realm-js queries on the Realms and Users tables. This can be useful, for example, when you have many similarly named Realms - for example `foo`, `foo1`, etc. and you want to find exactly `foo`. To run a manual query, prefix it with `!`. ([#1147](https://github.com/realm/realm-studio/pull/1147))
- Added progress labels when downloading a Realm file. ([#1148](https://github.com/realm/realm-studio/pull/1148))

### Fixed

- None

### Internals

- Using `react-inspector` instead of the `react-object-inspector` package. ([#1131](https://github.com/realm/realm-studio/issues/1131))
- Persist whether a user is Realm employee to avoid having to run studio with magic env variables. ([#1149](https://github.com/realm/realm-studio/pull/1149))
- Add an option to open the cache folder to make it easier to inspect client Realms. ([#1149](https://github.com/realm/realm-studio/pull/1149))
- Expose a way to connect to ROS from a custom url. ([#1149](https://github.com/realm/realm-studio/pull/1149))

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
