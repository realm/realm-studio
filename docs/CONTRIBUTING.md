# Contributing

## Filing Issues

Whether you find a bug, typo or an API call that could be clarified, please [file an issue](https://github.com/realm/realm-studio/issues) on our GitHub repository.

When filing an issue, please provide as much of the following information as possible in order to help others fix it:

1. **Goals**
2. **Expected results**
3. **Actual results**
4. **Steps to reproduce**
5. **Screenshots or screencast capturing the issue**
6. **Version of Realm Studio / Operating System**

If you'd like to send us sensitive data to help troubleshoot your issue, you can email <help@realm.io> directly.

## Contributing Enhancements

We love contributions to Realm! If you'd like to contribute code, documentation, or any other improvements, please [file a Pull Request](https://github.com/realm/realm-studio/pulls) on our GitHub repository. Make sure to accept our [CLA](#cla).

### Commit Messages

Although we don’t enforce a strict format for commit messages, we prefer that you follow the guidelines below, which are common among open source projects. Following these guidelines helps with the review process, searching commit logs and documentation of implementation details. At a high level, the contents of the commit message should convey the rationale of the change, without delving into much detail. For example, `setter names were not set right` leaves the reviewer wondering about which bits and why they weren’t “right”. In contrast, `[RLMProperty] Correctly capitalize setterName` conveys almost all there is to the change.

Below are some guidelines about the format of the commit message itself:

- Separate the commit message into a single-line title and a separate body that describes the change.
- Make the title concise to be easily read within a commit log.
- Make the body concise, while including the complete reasoning. Unless required to understand the change, additional code examples or other details should be left to the pull request.
- If the commit fixes a bug, include the number of the issue in the message.
- Use the first person present tense - for example "Fix …" instead of "Fixes …" or "Fixed …".
- For text formatting and spelling, follow the same rules as documentation and in-code comments — for example, the use of capitalization and periods.
- If the commit is a bug fix on top of another recently committed change, or a revert or reapply of a patch, include the Git revision number of the prior related commit, e.g. `Revert abcd3fg because it caused #1234`.

### CLA

Realm welcomes all contributions! The only requirement we have is that, like many other projects, we need to have a [Contributor License Agreement](https://en.wikipedia.org/wiki/Contributor_License_Agreement) (CLA) in place before we can accept any external code. Our own CLA is a modified version of the Apache Software Foundation’s CLA.

[Please submit your CLA electronically using our Google form](https://docs.google.com/forms/d/e/1FAIpQLSeQ9ROFaTu9pyrmPhXc-dEnLD84DbLuT_-tPNZDOL9J10tOKQ/viewform) so we can accept your submissions. The GitHub username you file there will need to match that of your Pull Requests. If you have any questions or cannot file the CLA electronically, you can email <help@realm.io>.

### Developer Guidelines

Please read the [Guidelines document](https://github.com/realm/realm-studio/blob/master/docs/GUIDELINES.md) for information about how this repository is structured and what tools are being used. Any changes should follow the guidelines in that document.

## Requirements

- Node v8.6.0 or later.

## Running

Run the application according to the release notes from where you've downloaded it.

If you've checked out this repository, install and start it by running

    npm install
    npm start

## Developing

Please read the [guidelines](./GUIDELINES.md) to familiarize with the code style and tools used to develop Realm Studio.

Check out this git repository.

Install dependencies from NPM:

    npm install

Start the developer (concurrently running 2x webpack and electron internally):

    npm run dev

To check if the source code complies with the TypeScript and SASS rules that we've decided, use your editors builtin checker or run the lint command:

    npm run lint

### Parameters

The application has support for some parameters that can be supplied when starting it:

- The `REALM_STUDIO_INTERNAL_FEATURES` environment variable can be set to show features in Realm Studio that are only useful for Realm employees, like being able to select the Staging server for the Cloud.

      REALM_STUDIO_INTERNAL_FEATURES=true

- The `DISPLAY` environment variable can be set to the index of the display that windows should be created on. So to start the application, opening windows on your secondary monitor, run

      DISPLAY=1 npm run dev

- If the `REALM_STUDIO_DEV_TOOLS` environment variable is set every window being opened will have the developer
  tools opened.

        REALM_STUDIO_DEV_TOOLS=true npm run dev

- If the `REALM_STUDIO_DISABLE_UPDATE_PROMPT` is set, Studio won't prompt the user before quitting and installing a newly downloaded update. This is used to test the auto-updater.

- If the `REACT_PERF` environment variable is set, the window URLs will get "?react_perf" appended, which will activate profiling of React components on the Chrome timeline: https://reactjs.org/blog/2016/11/16/react-v15.4.0.html#profiling-components-with-chrome-timeline

      REACT_PERF=true npm run dev

- If the `WHY_DID_YOU_UPDATE` environment variable is set, the renderer process React will be instrumented with a tool that prints the props before and after an update of a component.

      WHY_DID_YOU_UPDATE=true npm run dev

- If the `REALM_LOG_LEVEL` environment variable is set, this will get passed to `Realm.Sync.setLogLevel(` when the renderer processes start. It defaults to 'error'.

## Testing

To run all tests, run

    npm test

When developing on a specific feature, you can run a specific test each time files changes,

    npm test -- -w src/ui/reusable/realm-loading-component/index.test.ts

`-w` starts mocha-webpack in watch-mode and `src/ui/reusable/realm-loading-component/index.test.ts` is the relative path
of a test that will run every time a file in the project gets saved.

## Building

To build the app into resources that will be included into a releasable package, run the `build` script:

    npm run build

To build releasable packages for the various installable formats, run the `package` script:

    npm run package

This will clean the `./build` folder and run `build` internally, before using
[electron-builder](https://www.npmjs.com/package/electron-builder) to produce an Electron app ready for distribution.

## Releasing

See the section on [releasing](./RELEASING.md).

## Scripts

- `npm run check:package-lock` runs ./scripts/check-package-lock.js to check if the package locks version and dependencies are compatible with that of the package.json.
- `npm run check:auto-update-files` runs ./scripts/check-auto-update-files.js to check if the auto updating `latest-*` files are referring to the current version from the package.json and ensuring that it's not referencing any files that won't be available once released.
- `npm run generate-all-types-realm` runs ./scripts/generate-realm.js to generate a test realm with objects following the schema-exporters all-types schema.
- `npm run sentry:upload-symbols` downloads electron and uploads symbols to the Sentry error catching service, run this whenever the Electron version is changed.
