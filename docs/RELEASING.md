# Releasing Realm Studio

The instructions below is only possible to be performed by Realm employees.

## Prepare a release

Start by preparing a release from the branch you want to release from (default: `master`).

The version is automatically derived from the RELEASENOTES.md to comply with [semantic versioning](http://semver.org/),

Go to https://ci.realm.io/job/realm/job/realm-studio/job/channel%252Fmajor-11/build, check PREPARE and hit build to prepare a release.

When preparing Jenkins does the following:

1. Changes version based on release notes.
2. Copies release notes to changelog.
3. Restores the release notes from a template.
4. Commits the changes to a branch and pushes it to GitHub.
5. Creates a pull-request from the branch into master.

## Release a prepared release

The prepare job creates a PR which bumps the version and copies over release notes to the changelog, when reviewed and
the PR gets merged, Jenkins will notice that the version within the package.json has changed, which triggers the
following process:

1. Await user input to allow manual testing of the packaged artifacts.
2. Extract the latest release notes from the changelog.
3. Create a draft GitHub release.
4. Upload the packaged artifacts to the draft release.
5. Upload the packaged artifacts to S3.
6. Upload the auto-updating .yml files to S3.
7. Publish the GitHub release.
8. Announce the release on Slack.

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
