[Changes since {PREVIOUS_VERSION}](https://github.com/realm/realm-studio/compare/{PREVIOUS_VERSION}...{CURRENT_VERSION})

### Enhancements

- Added a prompt to upgrade (and optionally backup) when opening a Realm file which uses an outdated file format. This disables automatically upgrading local Realm files when opening them. ([#1236](https://github.com/realm/realm-studio/pull/1236))

### Fixed

- Fixed an issue occurring if a Realm had been opened from a server, deleted from the server and reopened in Studio. A local cache of the Realm would exist and instead of discarding the local copy entirely, the schema of the local copy would be written to the realm and uploaded to the server. ([#1238](https://github.com/realm/realm-studio/pull/1238)

### Internals

- None
