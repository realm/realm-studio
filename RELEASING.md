# Releasing Realm Studio

## Prepare a release

### On GitHub

First create a draft release on GitHub for the upcoming release: https://github.com/realm/realm-studio/releases/new.

Use "tag version" with includes the v-prefix (ex. "v.1.2.0") and document the enhancements, bug-fixes and internal
changes in the body of the release. Save this as a draft release. Remember to use the correct branch (probably master).

### On Jenkins

Start by preparing a release from the branch you want to release from (default: `master`).

You have to specify the version that you want to release - please use [semantic versioning](http://semver.org/), and
choose the next version based on what changes the master has compared to the latest release on the channel.

- `major` if the release introduces breaking changes.
- `minor` if the release adds features (and possibly fixes bugs too)
- `patch` if the release fixes bugs
- `prerelease` if on a prerelease channel, like `-alpha` or `-rc`.

To prepare a release, go to https://ci.realm.io/job/realm-studio/job/prepare/build.

To see what the prepare job does, see https://github.com/realm/realm-studio/blob/master/Jenkinsfile.prepare - this is
what it's basically doing:

1. Checkout the branch
2. Run `npm version` with the next version specified
3. Save that new version from the `package.json` into the `package-lock.json`
4. Commit in the two files changed
5. Tag the commit with the new version
6. Waiting for you to confirm the change - see
   [the console output](https://ci.realm.io/blue/organizations/jenkins/realm-studio%2Fprepare/activity)
   if you're wondering why the build is taking so long
7. Push the changes and tag to GitHub
8. Start a release job

## Release a prepared release

The prepare job starts a new release job as its final step, so usually you don't need to start the release job manually.

If you've just finished preparing a release, go to
https://ci.realm.io/blue/organizations/jenkins/realm-studio%2Frelease/activity

To start a previously prepared release manually, go to https://ci.realm.io/job/realm-studio/job/release/build and select
the version tag that you want to build and release for.

To see what the release job does, see https://github.com/realm/realm-studio/blob/master/Jenkinsfile.release - this is
what it's basically doing:

1. Checkout the branch
2. Check that the version tag matches the version in package.json
3. Build, test and package in two parallel tracks "MacOS" and "Others" (the latter being Windows + Linux).
    1. Installing dependencies (`npm install`)
    2. Build the app (`npm run build`)
    3. Package up the app (`electron-builder`) - never publishing and cryptographically signing the result
    4. Archive + stash artifacts
4. Once packaged - it'll post a message to Slack notifying that the job is awaiting approval to continue.
5. If approved - unstash and upload artifacts to S3
6. Post the release to Slack!

## Publish on GitHub

Go to [the release on GitHub](https://github.com/realm/realm-studio/releases) and publish the release.
This turns the release in to the latest release for users downloading the latest version via
https://studio-releases.realm.io/latest.
