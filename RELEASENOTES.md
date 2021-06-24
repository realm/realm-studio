[Changes since {PREVIOUS_VERSION}](https://github.com/realm/realm-studio/compare/{PREVIOUS_VERSION}...{CURRENT_VERSION})

### Enhancements

- None

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
