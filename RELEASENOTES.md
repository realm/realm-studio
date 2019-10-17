[Changes since {PREVIOUS_VERSION}](https://github.com/realm/realm-studio/compare/{PREVIOUS_VERSION}...{CURRENT_VERSION})

### Enhancements

- Added TypeScript schema exporter ([#1185](https://github.com/realm/realm-studio/pull/1185))

### Fixed

- Fixed displaying object level permissions for the correct object when the table of objects were filtered or sorted. ([#1180](https://github.com/realm/realm-studio/pull/1180))
- Fixed exporting schemas to Java and Kotlin. The @Required annotation was incorrectly applied to lists of non-primitives. ([#1181](https://github.com/realm/realm-studio/pull/1181), since v1.8.0)
- On Windows, ensure there'll be no unnecessary local path collisions when browsing multiple Realm Cloud instances. The effect would have been that Realms with the same name that resided on different servers would need to be redownloaded every time you switched servers. ([#1184](https://github.com/realm/realm-studio/pull/1184), since v3.7.0)
- Fixed displaying fatal errors in the Realm Browser. ([#1189](https://github.com/realm/realm-studio/pull/1189), since v1.0.0-rc.2)

### Internals

- Upgraded Realm JS to v3.2.0. ([#1177](https://github.com/realm/realm-studio/pull/1177))
