# Realm Studio

Realm Studio is the tool, any developer or system administrator would use when building and maintaining their app built
on the Realm Mobile Platform.

Visit https://realm.io/products/realm-studio/ for more information on Realm Studio.

## Installing

Click the links below to download the latest version of Realm Studio for
- [MacOS](https://studio-releases.realm.io/latest/download/mac-dmg)
- [Windows](https://studio-releases.realm.io/latest/download/win-setup)
- [Linux](https://studio-releases.realm.io/latest/download/linux-appimage)

## Running

Run the application according to the release notes from where you've downloaded it.

If you've checked out this repository, install and start it by running

    npm install
    npm start

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

### Parameters

The application has support for some parameters that can be supplied when starting it:

- The `DISPLAY` environment variable can be set to the index of the display that windows should be created on.
  So to start the application, opening windows on your secondary monitor, run

      DISPLAY=1 npm run dev

- If the `OPEN_DEV_TOOLS` environment variable is sat every window being opened will have the developer tools opened.

      OPEN_DEV_TOOLS=true npm run dev

- If the `REACT_PERF` environment variable is sat, the window URLs will get "?react_perf" appended, which will
activate profiling of React components on the Chrome timeline:
https://reactjs.org/blog/2016/11/16/react-v15.4.0.html#profiling-components-with-chrome-timeline

      REACT_PERF=true npm run dev

- If the `WHY_DID_YOU_UPDATE` environment variable is sat, the renderer process React will be instrumented with a
tool that prints the props before and after an update of a component.

      WHY_DID_YOU_UPDATE=true npm run dev

- If the `REALM_LOG_LEVEL` environment variable is sat, this will get passed to `Realm.Sync.setLogLevel(` when
  the renderer processes start. It defaults to 'error'.

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
- `./scripts/via-nvm.sh` installs node and npm in the version from `.nvmrc` and runs commands with that enabled, ex:

      ./scripts/via-nvm.sh node --version

  outputs

      Found '/Users/kraenhansen/Repositories/realm-studio/.nvmrc' with version <v8.6.0>
      v8.6.0 is already installed.
      Now using node v8.6.0 (npm v5.3.0)
      v8.6.0
