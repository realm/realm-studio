[Changes since {PREVIOUS_VERSION}](https://github.com/realm/realm-studio/compare/{PREVIOUS_VERSION}...{CURRENT_VERSION})

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
