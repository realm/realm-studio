[Changes since {PREVIOUS_VERSION}](https://github.com/realm/realm-studio/compare/{PREVIOUS_VERSION}...{CURRENT_VERSION})

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
