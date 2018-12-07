# Release 3.1.1 (2018-12-07)

[Changes since v3.1.0](https://github.com/realm/realm-studio/compare/v3.1.0...v3.1.1)

## Enhancements
- None

## Fixed
- Fixed focussing classes with a missing object in the `__Class` table. It would show "Permissions for [name] class is missing". ([#1037](https://github.com/realm/realm-studio/pull/1037), since 3.1.0)

## Internals
- None


# Release 3.1.0 (2018-12-07)

[Changes since v3.0.7](https://github.com/realm/realm-studio/compare/v3.0.7...v3.1.0)

## Enhancements
- When browsing a reference Realm a permission sidebar appears in the browser. ([#946](https://github.com/realm/realm-studio/pull/946))

## Fixed
- Fixed missing padding in the Realm browsers sidebar when a schema was missing ([#1026](https://github.com/realm/realm-studio/pull/1026))

## Internals
- Excluding the unpackaged directories when uploading to S3 (again). ([#1013](https://github.com/realm/realm-studio/pull/1013))
- Updated the message in the greeting window to include a button for signing up for the Realm Cloud. ([#1032](https://github.com/realm/realm-studio/pull/1032) and [#1035](https://github.com/realm/realm-studio/pull/1035))


# Release 3.0.7 (2018-11-16)

[Changes since v3.0.6](https://github.com/realm/realm-studio/compare/v3.0.6...v3.0.7)

## Enhancements
- None

## Fixed
- Fixed the automatic updating, which was was broken on Windows. ([#1004](https://github.com/realm/realm-studio/pull/1004))
- Fixed choosing a PM timestamp when creating an object with a datetime value. ([#1005](https://github.com/realm/realm-studio/pull/1005))
- Fixed adding a property when class had many properties and no objects. ([#1008](https://github.com/realm/realm-studio/pull/1008))
- Fixed scrolling the modal dialog after adding an object to list when creating objects. ([#1009](https://github.com/realm/realm-studio/pull/1009))
- Fixed the application menu, which was not updated until the user refocussed the window. ([#1011](https://github.com/realm/realm-studio/pull/1011))

## Internal
- Cleaned up the package.json by using semver instead of compare-versions and moved types to devDependencies. ([#1010](https://github.com/realm/realm-studio/pull/1010))
- Excluding the unpackaged directories when uploading to S3. ([#1012](https://github.com/realm/realm-studio/pull/1012))
- realm-js analytics have been disabled on the main process (similar to what we do for the renderer). ([#994](https://github.com/realm/realm-studio/issues/994))


# Release 3.0.6 (2018-11-14)

[Changes since v3.0.5](https://github.com/realm/realm-studio/compare/v3.0.5...v3.0.6)

## Enhancements
- None

## Fixed
- Windows are no longer rendering blank when connecting to a server on the Windows OS. ([#998](https://github.com/realm/realm-studio/pull/998))

## Internal
- Updated Webpack and dependant modules. ([#999](https://github.com/realm/realm-studio/pull/999))
- Updated TS-lint, Prettier and fixed linting errors. ([#1000](https://github.com/realm/realm-studio/pull/1000))


# Release 3.0.5 (2018-11-13)

[Changes since v3.0.4](https://github.com/realm/realm-studio/compare/v3.0.4...v3.0.5)

# Enhancements
- None

# Fixed
- Fixed the getting started scene of the server administration window, which was missing a button for the React Native quick start guide and the iOS and Android URLs was rendering 404 errors. ([#963](https://github.com/realm/realm-studio/pull/963))
- Fixed not showing the path-level permissions of a reference or partial Realm. ([#989](https://github.com/realm/realm-studio/pull/989))
- Fixed Windows getting smaller on the Windows OS each time the window was opened. ([#991](https://github.com/realm/realm-studio/pull/991))

# Internal
- Updated the changelog and releasenotes. ([#988](https://github.com/realm/realm-studio/pull/988))
- Upgraded to Electron 3.0 + dependencies ([#935](https://github.com/realm/realm-studio/pull/935))


# Release 3.0.4 (2018-11-12)

[Changes since v3.0.3](https://github.com/realm/realm-studio/compare/v3.0.3...v3.0.4)

## Enhancements
- None

## Fixed
- Fixed a crash when sorting a column with type list. ([#984](https://github.com/realm/realm-studio/pull/984))

## Internal
- Moved sentry id to the title and using the bug template for the body. ([#983](https://github.com/realm/realm-studio/pull/983))
- Automated building up release notes in this file as PRs are merged. ([#987](https://github.com/realm/realm-studio/pull/987))

---

The project didn't use to have a CHANGELOG.md.

The notes for previous releases can be found on GitHub: https://github.com/realm/realm-studio/releases
