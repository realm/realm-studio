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

## Testing

To run all tests, run

    npm test

When developing on a specific feature, you can run a specific test each time files changes,

    npm test -- -w src/ui/reusable/realm-loading-component/index.test.ts

`-w` starts mocha-webpack in watch-mode and `src/ui/reusable/realm-loading-component/index.test.ts` is the relative path
of a test that will run every time a file in the project gets saved.

## Building

To build the app into resources that will be included into a releasable package, run the `build` command:

    npm run build

To build releasable packages for the various installable formats, run the `dist` command:

    npm run dist

This will clean the `./build` folder and run `build` internally, before using
[electron-builder](https://www.npmjs.com/package/electron-builder) to produce an Electron app ready for distribution.

## Releasing

See the section on [releasing](./RELEASING.md).
