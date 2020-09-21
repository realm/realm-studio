# Changelog

All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).


## Release 10.0.0-beta.? (2020-??-??)

[Changes since v10.0.0-beta.2](https://github.com/realm/realm-studio/compare/v10.0.0-beta.2...v10.0.0-beta.?)

### Enhancements

- JSON export now supports circular structures. ([#1315](https://github.com/realm/realm-studio/pull/1315))
- Embedded Objects can now be created, edited, viewed & deleted ([#1321](https://github.com/realm/realm-studio/pull/1321))
- Lists of Embedded Objects now have same functionality as Linked Objects ([#1321](https://github.com/realm/realm-studio/pull/1321))
- UI: Add Property always visible ([#1321](https://github.com/realm/realm-studio/pull/1321))
- UI: Non sortable grid headers now have a different color ([#1321](https://github.com/realm/realm-studio/pull/1321))
- UI: Grid headers for Embedded Objects marked with `(embedded)` ([#1321](https://github.com/realm/realm-studio/pull/1321))

### Fixed

- Re-established JSON export functionality after v10 update [#1312](https://github.com/realm/realm-studio/issues/1312)
- Edit mode for primary keys has been disabled ([#1321](https://github.com/realm/realm-studio/pull/1321))

### Internals

- Electron v8.4.1
- Realm v10.0.0-beta.13


## Release 10.0.0-beta.2 (2020-06-16)

[Changes since v10.0.0-beta.1](https://github.com/realm/realm-studio/compare/v10.0.0-beta.1...v10.0.0-beta.2)

### Enhancements

- Updated the link to "Download a demo Realm file" on the greetings window, to link to a Realm file with the v11 file-format.

### Fixed

- None

### Internals

- None


## Release 10.0.0-beta.1 (2020-06-04)

This is the first release for MongoDB Realm to be used with the v10.0.0-beta versions of the Realm SDKs.

NOTE: This version do not support Realm Cloud and Realm Object Server. Realm Studio 3.11 is the latest
release that supports that.

### Breaking Changes (compared to Studio 3.11)
- All functionality related to the Realm Object Server (ROS), such as connecting to a server, opening synchronized Realms from it and managing users and their permissions has been removed. ([#1282](https://github.com/realm/realm-studio/pull/1282))
- All functionality related to the "legacy" Realm Cloud (available via https://cloud.realm.io/), such as authenticating and connecting to a server instance has been removed. ([#1282](https://github.com/realm/realm-studio/pull/1282))

### Enhancements
- Added support for creating & generating `ObjectId` when creating objects. ([#1291](https://github.com/realm/realm-studio/pull/1291))
- Added support for editing existing `ObjectId` values. ([#1290](https://github.com/realm/realm-studio/pull/1290))
- Primary keys in Class/Schema creation now defaults to an `ObjectId` property named `_id`.
- Added support for creating `Decimal128` when creating objects. ([#1292](https://github.com/realm/realm-studio/pull/1292))
- Added support for editing existing `Decimal128` values. ([#1292](https://github.com/realm/realm-studio/pull/1292))
- Added support for viewing and editing `Embedded Objects`([#1298](https://github.com/realm/realm-studio/pull/1298)). Creation of Embedded Objects is not supported yet.

### Fixed
- None

### Compatibility
- File format: Generates Realms with file format v11 (used by SDK v10.x.y versions). Earlier file formats can be read and automatically upgraded to v11. But you will not be able to edit older file formats. 

The notes for previous releases can be found on GitHub: https://github.com/realm/realm-studio/releases
