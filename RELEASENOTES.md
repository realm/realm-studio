[Changes since {PREVIOUS_VERSION}](https://github.com/realm/realm-studio/compare/{PREVIOUS_VERSION}...{CURRENT_VERSION})

## Enhancements
- Adding in-app messages from Realm to the Greeting window. ([#1056](https://github.com/realm/realm-studio/pull/1056))
- Error dialogs now clearly separates the failed intent and the message from the throw exception. ([#1061](https://github.com/realm/realm-studio/pull/1061))

## Fixed
- Fixed text rendering issue resulting in clipping of property name and types in the header of the browser window. It was only observed on Windows with high pixel density displays. ([#1059](https://github.com/realm/realm-studio/pull/1059), since v1.0.0)
- Fixed an issue where sidebars got resized when a window got resized despite the sidebar being collapsed. ([#1060](https://github.com/realm/realm-studio/pull/1060), since v2.7.0)
- Fixed potential issues from writing to partial Realms by opening them in a read-only mode. ([#1062](https://github.com/realm/realm-studio/pull/1062) & [#1063](https://github.com/realm/realm-studio/pull/1063), since v1.0.0)
- Fixed the error shown when connecting to a Realm Cloud instance with an expired token. ([#1067](https://github.com/realm/realm-studio/pull/1067), since v1.18.1)

## Internals
- Fixed the Dockerfile used when testing PRs. ([#1057](https://github.com/realm/realm-studio/pull/1057))
- Removing all existing and future unused locals. ([#1058](https://github.com/realm/realm-studio/pull/1058))
- Refactored singleton windows. ([#1066](https://github.com/realm/realm-studio/pull/1066))
