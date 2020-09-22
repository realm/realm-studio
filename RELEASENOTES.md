[Changes since {PREVIOUS_VERSION}](https://github.com/realm/realm-studio/compare/{PREVIOUS_VERSION}...{CURRENT_VERSION})

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
