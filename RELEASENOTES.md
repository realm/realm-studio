[Changes since {PREVIOUS_VERSION}](https://github.com/realm/realm-studio/compare/{PREVIOUS_VERSION}...{CURRENT_VERSION})

### Breaking Changes

- All functionality related to the Realm Object Server (ROS), such as connecting to a server, opening synchronized Realms from it and managing users and their permissions has been removed. ([#1282](https://github.com/realm/realm-studio/pull/1282))
- All functionality related to the "legacy" Realm Cloud (available via https://cloud.realm.io/), such as authenticating and connecting to a server instance has been removed. ([#1282](https://github.com/realm/realm-studio/pull/1282))

### Enhancements

- Added support for creating & generating `ObjectId` when creating objects. ([#1291](https://github.com/realm/realm-studio/pull/1291))
- Added support for editing existing `ObjectId` values. ([#1290](https://github.com/realm/realm-studio/pull/1290))
- Primary keys in Class/Schema creation now defaults to an `ObjectId` property named `_id`.

### Fixed

- None

### Internals

- None
