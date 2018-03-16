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

# How do I roll-back a release?

In the case where we've released something that needs to be rolled back we have the following options:

1. To prevent new users from downloading the broken version, unpublish the release on GitHub:
    1. Navigate to https://github.com/realm/realm-studio/releases/
    2. Find the latest (broken) release and click the "Edit" button
    3. Click "Save draft"
2. To prevent existing users from updating to the broken version, override the latest.yml files on S3 in one of two ways:
    1. Automatically: By going to https://ci.realm.io/job/realm-studio/job/release/build and starting a new build of a non-broken version.
    2. Manually: By downloading and re-uploading the .yml files that defines which is the latest version towards the auto updater:
        1. Find the latest successful build of the latest non-broken version on https://ci.realm.io/job/realm-studio/job/release/
        2. Download the `latest-linux.yml` `latest-mac.json` `latest-mac.yml` and `latest.yml` files
        3. Navigate to https://s3.console.aws.amazon.com/s3/buckets/static.realm.io/downloads/realm-studio/
        4. Upload and override the four .yml files to the S3 bucket.
