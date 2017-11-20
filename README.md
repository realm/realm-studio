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

### Parameters

The application has support for some parameters that can be supplied when starting it:

- The `DISPLAY` environment variable can be set to the index of the display that windows should be created on.
  So to start the application, opening windows on your secondary monitor, run

      DISPLAY=1 npm start

- If the `OPEN_DEV_TOOLS` environment variable is sat every window being opened will have the developer tools opened.

      OPEN_DEV_TOOLS=true npm start

- If the `REACT_PERF` environment variable is sat, the window URLs will get "?react_perf" appended, which will
activate profiling of React components on the Chrome timeline:
https://reactjs.org/blog/2016/11/16/react-v15.4.0.html#profiling-components-with-chrome-timeline

      REACT_PERF=true npm start

- If the `WHY_DID_YOU_UPDATE` environment variable is sat, the renderer process React will be instrumented with a
tool that prints the props before and after an update of a component.

      WHY_DID_YOU_UPDATE=true npm start

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
