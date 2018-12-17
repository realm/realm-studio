[Changes since {PREVIOUS_VERSION}](https://github.com/realm/realm-studio/compare/{PREVIOUS_VERSION}...{CURRENT_VERSION})

This version of Studio changes how Realm state and file size metrics (displayed in the server administration window) are fetched from the server. Consequently server must be at least version 3.16.0 to display these sizes correctly.

## Enhancements
- Showing connection state (disconnected, connecting or connected) in the server administration window. ([#1027](https://github.com/realm/realm-studio/pull/1027))
- No longer waiting for the entire admin Realm to download before showing realms and users in the server administration window. ([#1027](https://github.com/realm/realm-studio/pull/1027))

## Fixed
- Fixed displaying Realm state and file size in the server administration window. ([#1027](https://github.com/realm/realm-studio/pull/1027))

## Internals
- None
