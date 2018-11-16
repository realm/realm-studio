[Changes since {PREVIOUS_VERSION}](https://github.com/realm/realm-studio/compare/{PREVIOUS_VERSION}...{CURRENT_VERSION})

## Enhancements
- None

## Bugfixes
- The automatic updating was broken on Windows, to solve this the updater, builder and electron was downgraded to the latest stable versions. ([#1004](https://github.com/realm/realm-studio/pull/1004))
- When creating an object with a datetime value users were unable to choose an AM time, this got fixed by providing the correct format string to the date to string formatting method used. ([#1005](https://github.com/realm/realm-studio/pull/1005))

## Internal
- Cleaned up the package.json by using semver instead of compare-versions and moved types to devDependencies. ([#1010](https://github.com/realm/realm-studio/pull/1010))
