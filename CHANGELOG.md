# Release 3.0.7 (2018-11-16)

[Changes since v3.0.6](https://github.com/realm/realm-studio/compare/v3.0.6...v3.0.7)

## Enhancements
- None

## Bugfixes
- The automatic updating was broken on Windows, to solve this the updater, builder and electron was downgraded to the latest stable versions. ([#1004](https://github.com/realm/realm-studio/pull/1004))
- When creating an object with a datetime value users were unable to choose an AM time, this got fixed by providing the correct format string to the date to string formatting method used. ([#1005](https://github.com/realm/realm-studio/pull/1005))
- It was difficult to add property when class had many properties and no objects, this was fixed by transforming the AddColumn column into a button floating on-top-of the table header. ([#1008](https://github.com/realm/realm-studio/pull/1008))
- Users were unable to scroll the modal dialog after adding an object to list when creating objects, this was fixed in the Reactstrap dependency which got updated. ([#1009](https://github.com/realm/realm-studio/pull/1009))
- The top application menu was not updated until the user refocussed the window, this was fixed by rearranging when the menu got updated initially. ([#1011](https://github.com/realm/realm-studio/pull/1011))

## Internal
- Cleaned up the package.json by using semver instead of compare-versions and moved types to devDependencies. ([#1010](https://github.com/realm/realm-studio/pull/1010))
- Excluding the unpackaged directories when uploading to S3. ([#1012](https://github.com/realm/realm-studio/pull/1012))
- realm-js analytics have been disabled on the main process (similar to what we do for the renderer). ([#994](https://github.com/realm/realm-studio/issues/994))


# Release 3.0.6 (2018-11-14)

[Changes since v3.0.5](https://github.com/realm/realm-studio/compare/v3.0.5...v3.0.6)

## Enhancements
- None

## Bugfixes
- Windows are no longer rendering blank when connecting to a server on the Windows OS. ([#998](https://github.com/realm/realm-studio/pull/998))

## Internal
- Updated Webpack and dependant modules. ([#999](https://github.com/realm/realm-studio/pull/999))
- Updated TS-lint, Prettier and fixed linting errors. ([#1000](https://github.com/realm/realm-studio/pull/1000))


# Release 3.0.5 (2018-11-13)

[Changes since v3.0.4](https://github.com/realm/realm-studio/compare/v3.0.4...v3.0.5)

# Enhancements
- None

# Bugfixes
- The getting started scene of the server administration window was missing a button for the React Native quick start guide and the iOS and Android URLs was rendering 404 errors. This was fixed by adding the button and updating the URLs. (#963)
- On the server administrations Realm tab, a query-based partial or reference Realm had a path-level permissions block, which was confusing because path-level permissions are not enforced by the server for these Realms. This was fixed by removing the list of path-level permissions for these types of Realms. (#989)
- Windows was getting smaller on the Windows OS each time the window was opened. This was fixed by enforcing a lower bound on the window height when restoring it from the previous state. (#991)

# Internal
- Updates to the changelog and releasenotes. (#988)
- Upgrading to Electron 3.0 + dependencies (#935)


# Release 3.0.4 (2018-11-12)

[Changes since v3.0.3](https://github.com/realm/realm-studio/compare/v3.0.3...v3.0.4)

## Enhancements
- None

## Bugfixes
- Addressed a crash happening when sorting the browsers table on a column with type list. This was fixed by disabling sorting on list properties. (#984)

## Internal
- Moved sentry id to the title and using the bug template for the body. (#983)
- Building up release notes in this file as PRs are merged. (#987)

---

The project didn't use to have a CHANGELOG.md.

The notes for previous releases can be found on GitHub: https://github.com/realm/realm-studio/releases
