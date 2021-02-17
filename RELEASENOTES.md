[Changes since {PREVIOUS_VERSION}](https://github.com/realm/realm-studio/compare/{PREVIOUS_VERSION}...{CURRENT_VERSION})

### Enhancements

- None

### Fixed

- When exporting to JSON, `'data'` properties are serialized to base64-strings, and not `{}`. ([#1367](https://github.com/realm/realm-studio/pull/1367), since v10.1.0)
- Fixed CSV importing into an existing Realm a bit more. The user now gets to choose what class data gets imported into. ([#1391](https://github.com/realm/realm-studio/pull/1391), since 1.12.0 & 5.0.2)

### Internals

- Migrated from tslint to eslint. ([#1388](https://github.com/realm/realm-studio/pull/1388))
