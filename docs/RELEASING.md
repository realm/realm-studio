# Releasing Realm Studio

The instructions below is only possible to be performed by Realm employees.

## Prepare a release

Start by preparing a release from the branch you want to release from (default: `master`).

The version is automatically derived from the CHANGELOG.md to comply with [semantic versioning](http://semver.org/),

Go to https://github.com/realm/realm-studio/actions and select "Prepare Release". Run the workflow, optionally adding
a version number.

When preparing the action does the following:

1. Changes version based on release notes.
2. Updates package.json and package-lock.json
3. Commits the changes to a branch and pushes it to GitHub.
4. Creates a pull-request from the branch into master.

## Release a prepared release

Currently the release building is triggered manually after merging the release PR, using the "Build, sign and publish
release" workflow. Once everything is confirmed stable merging of the release PR can be added to that workflow to
eliminate one step.

This workflow:

1. Builds and signs artifacts for macOS, Linux and Windows
2. Extract the latest release notes from the changelog.
3. Uploads the packaged artifacts and auto-update yaml files to S3
4. Creates a GitHub release, with the artifacts attached.
5. Announces the release on Slack.

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
