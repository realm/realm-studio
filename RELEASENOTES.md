[Changes since {PREVIOUS_VERSION}](https://github.com/realm/realm-studio/compare/{PREVIOUS_VERSION}...{CURRENT_VERSION})

## Enhancements

- None

## Fixed

- Clicking "Open in Studio" on the Realm Cloud frontend, no longer yields an error. ([#1098](https://github.com/realm/realm-studio/pull/1098))

## Internals
- Added a post-package test to ensure auto-updating functions. ([#1095](https://github.com/realm/realm-studio/pull/1095))
- Updated all dependencies, including Electron to v4 and Realm JS to v2.23.0. ([#1095](https://github.com/realm/realm-studio/pull/1095))
- Adding a segfault handler which produces a stack trace when a segmentation fault occurs. ([#1082](https://github.com/realm/realm-studio/pull/1082))
