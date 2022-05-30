[Changes since {PREVIOUS_VERSION}](https://github.com/realm/realm-studio/compare/{PREVIOUS_VERSION}...{CURRENT_VERSION})

### Enhancements

- None

### Fixed

- Realm files which are simultaneously opened in the iOS simulator via the Realm Swift SDK v10.27.0, can now be opened in Studio too.

### Internals

- Bump the version number for the lockfile used for interprocess synchronization. This has no effect on persistent data, but means that versions of Realm which use pre-12.0.0 Realm Core cannot open Realm files at the same time as they are opened by this version. Notably this includes Realm Studio, and Realm Core v11.1.2/Realm JavaScript v10.17.0 (the latest at the time of this release) cannot open Realm files which are simultaneously open in the iOS simulator.
