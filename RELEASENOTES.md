[Changes since {PREVIOUS_VERSION}](https://github.com/realm/realm-studio/compare/{PREVIOUS_VERSION}...{CURRENT_VERSION})

### Enhancements

- Improved how log entries are displayed in the server adminstration window: The timestamp now displays the date when the entry is not from the current day and the context object gets expanded initially. ([#1131](https://github.com/realm/realm-studio/issues/1131), since v1.20.0)
- Added a menu item to export data to JSON or a local Realm from the Realm Browser window. When exporting to a local Realm the file will be compacted and saved without additional free space. ([#1134](https://github.com/realm/realm-studio/pull/1134))

### Fixed

- None

### Internals

- Using `react-inspector` instead of the `react-object-inspector` package. ([#1131](https://github.com/realm/realm-studio/issues/1131))
