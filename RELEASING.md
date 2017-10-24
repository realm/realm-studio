# Releasing Realm Studio

## Prepare a release

Start by preparing a release from the branch you want to release from (default: `master`).

You have to specify the version that you want to release - please use [semantic versioning](http://semver.org/), and
choose the next version based on what changes the master has compared to the latest release on the channel.

- `major` if the release introduces breaking changes.
- `minor` if the release adds features (and possibly fixes bugs too)
- `patch` if the release fixes bugs
- `prerelease` if on a prerelease channel, like `-alpha` or `-rc`.

To prepare a release, go to https://ci.realm.io/job/realm-studio/job/prepare/build.

To see what the prepare job does, see https://github.com/realm/realm-studio/blob/master/Jenkinsfile.prepare.

## Release a prepared release

To publish the release, go to https://ci.realm.io/job/realm-studio/job/release/build and select the version tag that
you want to build and release for.

To see what the release job does, see https://github.com/realm/realm-studio/blob/master/Jenkinsfile.release.
