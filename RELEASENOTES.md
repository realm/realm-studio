[Changes since {PREVIOUS_VERSION}](https://github.com/realm/realm-studio/compare/{PREVIOUS_VERSION}...{CURRENT_VERSION})

## Enhancements
- None

## Bugfixes
- The automatic updating was broken on Windows, to solve this the updater, builder and electron was downgraded to the latest stable versions. ([#1004](https://github.com/realm/realm-studio/pull/1004))
- When creating an object with a datetime value users were unable to choose an AM time, this got fixed by providing the correct format string to the date to string formatting method used. ([#1005](https://github.com/realm/realm-studio/pull/1005))
- It was difficult to add property when class had many properties and no objects, this was fixed by transforming the AddColumn column into a button floating on-top-of the table header. ([#1008](https://github.com/realm/realm-studio/pull/1008))

## Internal
- None
