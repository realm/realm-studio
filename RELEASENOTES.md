[Changes since {PREVIOUS_VERSION}](https://github.com/realm/realm-studio/compare/{PREVIOUS_VERSION}...{CURRENT_VERSION})

### Enhancements

- Added a prompt to upgrade (and optionally backup) when opening a Realm file which uses an outdated file format. This disables automatically upgrading local Realm files when opening them. ([#1236](https://github.com/realm/realm-studio/pull/1236))

### Fixed

- None

### Internals

- Upgraded Realm JS to v4.0.0-beta.0, forcing an upgrade of the Realm file format when opening Realm files with the browser.
