# Changelog

## Release 14.0.4 (2023-09-11)

[Changes since v14.0.3](https://github.com/realm/realm-studio/compare/v14.0.3...v14.0.4)

### Enhancements

- None

### Fixed

- Fixed a bug where opening a Realm that contains asymmetric tables will crash the process with an error saying `You cannot query an asymmetric class`. ([#1591](https://github.com/realm/realm-studio/issues/1591))
- Fixed an issue where opening a synchronized Realm that is open in another process would result in an error with a message `History type not consistent`. ([#1593](https://github.com/realm/realm-studio/issues/1593))

### Internals

- None


## Release 14.0.3 (2023-05-10)

[Changes since v14.0.2](https://github.com/realm/realm-studio/compare/v14.0.2...v14.0.3)

### Enhancements

- None

### Fixed

- Fixed a bug in the Realm file upgrade logic. ([#1577](https://github.com/realm/realm-studio/issues/1577), since v14.0.0)

### Internals

- None


## Release 14.0.2 (2023-04-26)

[Changes since v14.0.1](https://github.com/realm/realm-studio/compare/v14.0.1...v14.0.2)

### Enhancements

- None

### Fixed

- Fix a bug preventing opening a synced Realm. ([#1574](https://github.com/realm/realm-studio/issues/1574), since v14.0.0)

### Internals

- None


## Release 
### Enhancements

- None

### Fixed

- Fix a bug preventing opening a synced Realm. ([#1574](https://github.com/realm/realm-studio/issues/1574), since v14.0.0)

### Internals

- None

## Release 14.0.1 (2023-04-21)

[Changes since v14.0.0](https://github.com/realm/realm-studio/compare/v14.0.0...v14.0.1)

### Enhancements

- None

### Fixed

- How to detect encrypted Realm files has slightly changed and made it impossible to open encrypted files. ([#1571](https://github.com/realm/realm-studio/issues/1571), since v14.0.0)

### Internals

- None


## Release 14.0.0 (2023-04-13)

[Changes since v13.0.2](https://github.com/realm/realm-studio/compare/v13.0.2...v14.0.0)

### Breaking Changes

* The layout of the lock-file has changed, the lock file format version is bumped and all participants in a multiprocess scenario needs to be up to date so they expect the same format. ([realm/realm-core#1845](https://github.com/realm/realm-core/issues/1845))

### Enhancements

- None

### Fixed

- None

### Internals

- Skipping version 13.0.1.
- Upgraded a lot of dependencies. ([#1568](https://github.com/realm/realm-studio/pull/1568))
- Upgraded Electron to v24.
- Upgraded Realm JS to v11.8.0.


## Release 13.0.2 (2022-12-08)

[Changes since v13.0.0](https://github.com/realm/realm-studio/compare/v13.0.0...v13.0.2)

### Enhancements

- None

### Fixed

- The produced checksum in version 13.0.0 was incorrect. ([#1554](https://github.com/realm/realm-studio/issues/1554), since v13.0.0)

### Internals

- None


## Release 13.0.0 (2022-11-24)

[Changes since v12.0.0](https://github.com/realm/realm-studio/compare/v12.0.0...v13.0.0)

### Breaking Changes
* File format version bumped. If Realm file contains any objects with set of `mixed` or dictionary properties, the file will go through an upgrade process.
* The layout of the lock-file has changed, the lock file format version is bumped and all participants in a multiprocess scenario needs to be up to date so they expect the same format. ([realm/realm-core#5440](https://github.com/realm/realm-core/pull/5440))
* Export data to JSON is using [`flatted`](https://www.npmjs.com/package/flatted), and if you are importing data in another application, you have to use `Flatted#parse`.

### Enhancements

- None

### Fixed

- None

### Internals

- Upgraded Realm JS to v11.3.0-rc.1.

### Compatibility

Use this version of Realm Studio to read and write Realm database files, using the same lock file format as:

| SDK              | Version          |
| ---------------- | ---------------- |
| Realm JavaScript | v11.3.0 - ? |
| Realm Swift      |  |
| Realm Kotlin     | v1.6.0- ? |
| Realm DotNet     | v10.19.0 - ? |
| Realm Dart       | v0.9.0+rc - ? |
| Realm Java       |  |


## Release 12.0.0 (2022-06-07)

[Changes since v11.2.1](https://github.com/realm/realm-studio/compare/v11.2.1...v12.0.0)

### Breaking Changes

- When opening a Realm file which is already opened by another process (such as the Realm Swift SDK in a simulator), the major version of core (more specifically the database and lock file formats) must match.

### Enhancements

- None

### Fixed

- None

### Internals

- Renamed app from "MongoDB Realm Studio" to "Realm Studio"
- Upgraded Realm JS to v10.19.1. ([#1514](https://github.com/realm/realm-studio/pull/1514))

### Compatibility

Use this version of Realm Studio to read and write Realm database files, using the same lock file format as:

| SDK              | Version      |
| ---------------- | ------------ |
| Realm JavaScript | v10.18.0 - ? |
| Realm Swift      | v10.27.0 - ? |


## Release 11.2.1 (2022-06-03)

[Changes since v11.2.0](https://github.com/realm/realm-studio/compare/v11.2.0...v11.2.1)

### Enhancements

- None

### Fixed

- Reverted an accidental upgrade of Realm JS.

### Internals

- None


## Release 11.2.0 (2022-06-02)

[Changes since v11.1.2](https://github.com/realm/realm-studio/compare/v11.1.2...v11.2.0)

### Enhancements

- Improved error message when opening a Realm file which is already opened by another process opening the lock file with an mismatching format version.

### Fixed

- None

### Internals

- Upgraded a lot of dependencies, including Electron to v19 ([#1507](https://github.com/realm/realm-studio/pull/1507), [#1506](https://github.com/realm/realm-studio/pull/1506), [#1505](https://github.com/realm/realm-studio/pull/1505))


## Release 11.1.2 (2022-04-12)

[Changes since v11.1.1](https://github.com/realm/realm-studio/compare/v11.1.1...v11.1.2)

### Enhancements

- None

### Fixed

- None

### Internals

- Upgraded Realm JS to v10.16.0. ([#1488](https://github.com/realm/realm-studio/pull/1488) and [#1496](https://github.com/realm/realm-studio/pull/1496))

## Release 11.1.1 (2021-12-06)

[Changes since v11.1.0](https://github.com/realm/realm-studio/compare/v11.1.0...v11.1.1)

### Enhancements

- None

### Fixed

- Implemented a simpler and shallow way of serializing objects (and lists of objects) in the browser. ([#1452](https://github.com/realm/realm-studio/pull/1452), since v11.0.0)

### Internals

- Upgrading all dependencies, including Electron to v16 and Bootstrap to v5 ([#1449](https://github.com/realm/realm-studio/pull/1449))


## Release 11.1.0 (2021-07-08)

[Changes since v11.0.1](https://github.com/realm/realm-studio/compare/v11.0.1...v11.1.0)

### Enhancements

- Added reading properties of type "Dictionary". ([#1443](https://github.com/realm/realm-studio/pull/1443))

### Fixed

- Fixed opening synchronized Realm files. ([#1443](https://github.com/realm/realm-studio/pull/1443))

### Internals

- Upgraded Realm JS to v10.6.0. ([#1443](https://github.com/realm/realm-studio/pull/1443))


## Release 11.0.1 (2021-06-29)

[Changes since v11.0.0](https://github.com/realm/realm-studio/compare/v11.0.0...v11.0.1)

### Enhancements

- None

### Fixed

- Fixed browsing Realms on non-darwin platforms. ([184667](https://github.com/realm/realm-studio/commit/1846675e7cece3a404a07689fcffdd2e11b2a6bf))

### Internals

- None


## Release 11.0.0 (2021-06-24)

[Changes since v11.0.0-beta.1](https://github.com/realm/realm-studio/compare/v10.1.2...v11.0.0)

### Breaking Changes

- Added support for reading / writing Realm files using Realm file format v22 (This supports a number of new datatypes available with beta versions of realm-js v10.5.0, realm-java v10.6.0, realm-cocoa v10.8.0 and realm-dotnet v10.2.0). When opening a file which is using an older format, you will get prompted to upgrade (and optionally backup) the Realm file. NOTE: Once the file has been upgraded, there is no way to downgrade it again and it can only be used by the SDKs that support Realm file format v22.

### Enhancements

- Added the ability to choose "All Files" when opening a Realm file, enabling opening files regardless of their file extension. ([#1410](https://github.com/realm/realm-studio/pull/1410))
- Added reading and writing properties of type "UUID". ([#1404](https://github.com/realm/realm-studio/pull/1404))
- Added reading properties of type "Set" and "Mixed". NOTE: Dictionary support got disabled in Realm JS after the merge of this PR. ([#1419](https://github.com/realm/realm-studio/pull/1419))

### Fixed

- "Download a demo Realm file" links to a demo-files of the correct file-format. ([#1429](https://github.com/realm/realm-studio/pull/1429))
- Contained errors from rendering a cell to the cell component that threw. ([#1435](https://github.com/realm/realm-studio/pull/1435))

### Internals

- None


## Release 11.0.0-beta.1 (2021-05-21)

[Changes since v11.0.0-beta.0](https://github.com/realm/realm-studio/compare/v11.0.0-beta.0...v11.0.0-beta.1)

### Enhancements

- None

### Fixed

- Fixed the "browser" window crashing (rendered a white screen). The Realm JS native module was missing from the asar archive after the change to cmake moved the build artifacts. ([#1426](https://github.com/realm/realm-studio/pull/1426))

### Internals

- None


## Release 11.0.0-beta.0 (2021-05-18)

[Changes since v11.0.0-alpha.0](https://github.com/realm/realm-studio/compare/v11.0.0-alpha.0...v11.0.0-beta.0)

### Breaking Changes

- Added support for reading / writing Realm files using Realm file format v21 (This supports a number of new datatypes available with beta versions of realm-js v10.5.0, realm-java v10.6.0, realm-cocoa v10.8.0 and realm-dotnet v10.2.0). When opening a file which is using an older format, you will get prompted to upgrade (and optionally backup) the Realm file. NOTE: Once the file has been upgraded, there is no way to downgrade it again and it can only be used by the SDKs that support Realm file format v21.

### Enhancements

- Added reading properties of type "Set", "Dictionary" and "Mixed". ([#1419](https://github.com/realm/realm-studio/pull/1419))

### Fixed

- None

### Internals

- None


## Release 11.0.0-alpha.0 (2021-05-03)

[Changes since v10.1.2](https://github.com/realm/realm-studio/compare/v10.1.2...v11.0.0-alpha.0)

### Breaking Changes

- Added support for reading / writing Realm files using Realm file format v21 (This supports a number of new datatypes available with beta versions of realm-js v?.?.?, realm-java v?.?.?, realm-cocoa v?.?.? and realm-dotnet v?.?.?). When opening a file which is using an older format, you will get prompted to upgrade (and optionally backup) the Realm file. NOTE: Once the file has been upgraded, there is no way to downgrade it again and it can only be used by the SDKs that support Realm file format v21.

### Enhancements

- Added the ability to choose "All Files" when opening a Realm file, enabling opening files regardless of their file extension. ([#1410](https://github.com/realm/realm-studio/pull/1410))
- Added reading and writing properties of type "UUID". ([#1404](https://github.com/realm/realm-studio/pull/1404))

### Fixed

- None

### Internals

- None

### Compatibility

- File format: Generates Realms with file format v21. Earlier file formats can be read and automatically upgraded to v21. But you will not be able to edit older file formats.


## Release 10.1.2 (2021-02-17)

[Changes since v10.1.1](https://github.com/realm/realm-studio/compare/v10.1.1...v10.1.2)

### Enhancements

- None

### Fixed

- When exporting to JSON, `'data'` properties are serialized to base64-strings, and not `{}`. ([#1367](https://github.com/realm/realm-studio/pull/1367), since v10.1.0)
- Fixed CSV importing into an existing Realm a bit more. The user now gets to choose what class data gets imported into. ([#1391](https://github.com/realm/realm-studio/pull/1391), since 1.12.0 & 5.0.2)

### Internals

- Migrated from tslint to eslint. ([#1388](https://github.com/realm/realm-studio/pull/1388))


## Release 10.1.1 (2021-01-28)

[Changes since v10.1.0](https://github.com/realm/realm-studio/compare/v10.1.0...v10.1.1)

### Enhancements

- None

### Fixed

- Fixed CSV importing into an existing Realm. The schema declared by the Realm file was not used, but instead generated from the in the CSV file data. ([#1382](https://github.com/realm/realm-studio/pull/1382), since 1.12.0)
- Fixed the ability to run on Apple M1 SoC based computers. ([#1386](https://github.com/realm/realm-studio/pull/1386))

### Internals

- Upgraded Electron to v11. ([#1386](https://github.com/realm/realm-studio/pull/1386))


## Release 10.1.0 (2021-01-13)

[Changes since v10.0.1](https://github.com/realm/realm-studio/compare/v10.0.1...v10.1.0)

### Enhancements

- Improved the experience of errors thrown when loading the Realm browser. ([#1377](https://github.com/realm/realm-studio/pull/1377))

### Fixed

- Fixed opening synced Realms devices. ([#1378](https://github.com/realm/realm-studio/pull/1378))

### Internals

- None


## Release 10.0.1 (2020-11-12)

[Changes since v10.0.0](https://github.com/realm/realm-studio/compare/v10.0.0...v10.0.1)

### Enhancements

- None

### Fixed

- When opening an encrypted Realm, users were shown an error instead of the prompt to enter an encryption key. ([#1351](https://github.com/realm/realm-studio/pull/1351), since v10.0.0)

### Internals

- None


## Release 10.0.0 (2020-10-16)

[Changes since v5.0.0](https://github.com/realm/realm-studio/compare/v5.0.0...v10.0.0)

This is the first release for MongoDB Realm to be used with the v10.0.0 versions of the Realm SDKs.

NOTE: This version do not support Realm Cloud and Realm Object Server. Realm Studio 5.0.0 is the latest
release that supports that.

### Breaking Changes (compared to v5.0.0)
- All functionality related to the Realm Object Server (ROS), such as connecting to a server, opening synchronized Realms from it and managing users and their permissions has been removed. ([#1282](https://github.com/realm/realm-studio/pull/1282))
- All functionality related to the "legacy" Realm Cloud (available via https://cloud.realm.io/), such as authenticating and connecting to a server instance has been removed. ([#1282](https://github.com/realm/realm-studio/pull/1282))

### Enhancements

- Mac app is now notarized. ([#1339](https://github.com/realm/realm-studio/pull/1339))
- JSON export now supports circular structures. ([#1315](https://github.com/realm/realm-studio/pull/1315))
- Embedded Objects can now be created, edited, viewed & deleted ([#1321](https://github.com/realm/realm-studio/pull/1321))
- Lists of Embedded Objects now have same functionality as Linked Objects ([#1321](https://github.com/realm/realm-studio/pull/1321))
- UI: Add Property always visible ([#1321](https://github.com/realm/realm-studio/pull/1321))
- UI: Non sortable grid headers now have a different color ([#1321](https://github.com/realm/realm-studio/pull/1321))
- UI: Grid headers for Embedded Objects marked with `(embedded)` ([#1321](https://github.com/realm/realm-studio/pull/1321))
- Schema export now supports new types (`ObjectId`, `Decimal128` & Embedded Objects). ([#1329](https://github.com/realm/realm-studio/pull/1329))
- Updated the link to "Download a demo Realm file" on the greetings window, to link to a Realm file with the v20 file-format.
- Added support for creating & generating `ObjectId` when creating objects. ([#1291](https://github.com/realm/realm-studio/pull/1291))
- Added support for editing existing `ObjectId` values. ([#1290](https://github.com/realm/realm-studio/pull/1290))
- Primary keys in Class/Schema creation now defaults to an `ObjectId` property named `_id`.
- Added support for creating `Decimal128` when creating objects. ([#1292](https://github.com/realm/realm-studio/pull/1292))
- Added support for editing existing `Decimal128` values. ([#1292](https://github.com/realm/realm-studio/pull/1292))
- Added support for viewing and editing `Embedded Objects`([#1298](https://github.com/realm/realm-studio/pull/1298)).

### Fixed

- Edit mode for primary keys has been disabled ([#1321](https://github.com/realm/realm-studio/pull/1321))

### Compatibility

- File format: Generates Realms with file format v20 (used by SDK v10.x.y versions). Earlier file formats can be read and automatically upgraded to v20. But you will not be able to edit older file formats.

### Internals

- Electron v8.5.2
- Realm v10.0.0


## Release 5.0.0 (2020-09-22)

[Changes since v4.0.0](https://github.com/realm/realm-studio/compare/v4.0.0...v5.0.0)

### Breaking Changes

- Added support for reading / writing Realm files using Realm file format v11 (used by realm-js v6.1.1, realm-java v7.0.4, realm-cocoa v5.4.0 and realm-dotnet v5.0.1). When opening a file which is using an older format, you will get prompted to upgrade (and optionally backup) the Realm file. NOTE: Once the file has been upgraded, there is no way to downgrade it again and it can only be used by the SDKs that support Realm file format v11. ([#1331](https://github.com/realm/realm-studio/pull/1331))

### Enhancements

- None

### Fixed

- None

### Compatibility

Use this version of Realm Studio to read and write Realm database files, using the same file format as:

| SDK              | Version    |
| ---------------- | ---------- |
| Realm JavaScript | 6.1.1 - ?  |
| Realm Java       | v7.0.4 - ? |
| Realm Cocoa      | v5.4.0 - ? |
| Realm .NET       | v5.0.1 - ? |

### Internals

- Upgraded Realm to v6.1.2. ([#1331](https://github.com/realm/realm-studio/pull/1331))
- Upgraded Electron to v9.3.1 and Spectron to v11.1.0 ([#1332](https://github.com/realm/realm-studio/pull/1332))


## Release 4.0.0 (2020-09-22)

[Changes since v3.10.0](https://github.com/realm/realm-studio/compare/v3.11.0...v4.0.0)

This is mostly a re-release of v3.11.0, except now with a major version bump because we discovered the upgrade of file format to v10 was in-fact breaking users workflows.

### Breaking Changes

- Added support for reading / writing Realm files using Realm file format v10 (used by realm-js v6, realm-java v7, realm-cocoa v5 and realm-dotnet v5.0.0). When opening a file which is using an older format, you will get prompted to upgrade (and optionally backup) the Realm file. NOTE: Once the file has been upgraded, there is no way to downgrade it again and it can only be used by the SDKs that support Realm file format v10. ([#1278](https://github.com/realm/realm-studio/pull/1278))

### Enhancements

- None

### Fixed

- None

### Compatibility

Use this version of Realm Studio to read and write Realm database files, using the same file format as:

| SDK              | Version          |
| ---------------- | ---------------- |
| Realm JavaScript | v6.0.0 - v6.1.0  |
| Realm Java       | v7.0.0 - v7.0.3  |
| Realm Cocoa      | v5.0.0 - v5.3.6  |
| Realm .NET       | v5.0.0 (removed) |

### Internals

- Auto updating will now look for updates on the "major-4" channel.


## Release 3.10.1 (2020-09-18)

[Changes since v3.10.0](https://github.com/realm/realm-studio/compare/v3.10.0...v3.10.1)

### Enhancements

- None

### Fixed

- None

### Internals

- Auto updating will now look for updates on the "major-3" channel.


## Release 3.11.0 (2020-05-06)

[Changes since v3.10.0](https://github.com/realm/realm-studio/compare/v3.10.0...v3.11.0)

### Enhancements

- Added support for reading / writing Realm files using Realm file format v10 (used by realm-js v6, realm-java v7, realm-cocoa v5 and realm-dotnet v5). When opening a file which is using an older format, you will get prompted to upgrade (and optionally backup) the Realm file. NOTE: Once the file has been upgraded, there is no way to downgrade it again and it can only be used by the SDKs that support Realm file format v10. ([#1278](https://github.com/realm/realm-studio/pull/1278))

### Fixed

- None

### Internals

- Upgraded dependencies, including Electron to v8 and Realm to v6.0.0. ([#1278](https://github.com/realm/realm-studio/pull/1278) & [#1284](https://github.com/realm/realm-studio/pull/1284))


## Release 3.10.0 (2020-03-06)

[Changes since v3.9.0](https://github.com/realm/realm-studio/compare/v3.9.0...v3.10.0)

### Enhancements

- Added a MongoDB Realm CTA to the marketing panel. ([#1266](https://github.com/realm/realm-studio/pull/1266))

### Fixed

- Fixed missing update of the browser UI when another client updates the schema of a Realm. ([#1256](https://github.com/realm/realm-studio/pull/1256))

### Internals

- None


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
