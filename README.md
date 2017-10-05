# Realm Studio

Realm Studio is the tool, any developer or system administrator would use when building and maintaining their app built
on the Realm Mobile Platform.

## Installing

Realm Studio has not yet been officially released.

Once it has - this section should contain links from where it can be downloaded and installed.

## Running

Run the application according to the release notes from where you've downloaded it.

If you've checked out this repository, install and start it by running

    npm install
    npm start

### Parameters

The application has support for some parameters that can be supplied when starting it:

- The `DISPLAY` environment variable can be set to the index of the display that windows should be created on.
  So to start the application, opening windows on your secondary monitor, run

      DISPLAY=1 npm start


## Developing

Check out this git repository.

Install dependencies from NPM:

    npm install

Start the developer (concurrently running 2x webpack and electron internally):

    npm run dev

Please read the [guidelines](./GUIDELINES.md) to familiarize with the code style and tools used to develop Realm Studio.

To check if the source code complies with the TypeScript and SASS rules that we've decided, use your editors builtin
checker or run the lint command:

    npm run lint

## Building

To build the app into resources that will be included into a releasable package, run the `build` command:

    npm run build

To build releasable packages for the various installable formats, run the `dist` command:

    npm run dist

This will clean the `./build` folder and run `build` internally, before using
[electron-builder](https://www.npmjs.com/package/electron-builder) to produce an Electron app ready for distribution.

## Releasing

The release flow is based on Electron Builder's ["Recommended GitHub Releases Workflow"](https://www.electron.build/publishing-artifacts).

1. Make sure the `package.json` specifies a version that has not yet been released.
2. [Create a new draft release](https://github.com/realm/realm-studio/releases/new) on GitHub.
  1. Enter the version from `package.json` as the tag, but prepend it with a "v".
  2. Make one or more merges to the master branch with this new version in the `package.json`. Every [successful build on CI](https://ci.realm.io/blue/organizations/jenkins/realm%2Frealm-studio/activity/) with the same version will upload build artifacts (the .dmg package for distribution on Mac), as long as the release is in draft.
  3. Once satisfied with the result, consider if it's a pre-release and publish the release.
3. Prepare the next version by bumping the minor version (-.x.-) of the `package.json`.
4. Announce the release on Slack in the #releases channel if a bot has not already done that.

Note: We should be using [semantic versioning](http://semver.org/), incrementing the major (x.-.-) version when breaking
breaking backwards compatibility and incrementing the patch (-.-.x) when an upcoming release is simply fixing bugs in the
previous version.
