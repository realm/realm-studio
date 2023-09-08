[Changes since {PREVIOUS_VERSION}](https://github.com/realm/realm-studio/compare/{PREVIOUS_VERSION}...{CURRENT_VERSION})

### Enhancements

- None

### Fixed

- Fixed a bug where opening a Realm that contains asymmetric tables will crash the process with an error saying `You cannot query an asymmetric class`. ([#1591](https://github.com/realm/realm-studio/issues/1591))
- Fixed an issue where opening a synchronized Realm that is open in another process would result in an error with a message `History type not consistent`. ([#1593](https://github.com/realm/realm-studio/issues/1593))

### Internals

- None
