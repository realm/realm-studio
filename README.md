# Realm Studio

Realm Studio is the tool, any developer or system administrator would use when building and maintaining their app built
on the Realm Mobile Platform.

## Installing

Realm Studio has not yet been officially released.

Once it has - this section should contain links from where it can be downloaded and installed.

## Running

Start the application running:

    ./node_modules/.bin/electron ./build/main.bundle.js

### Parameters

The application has support for some parameters that can be supplied when starting it:

- The `DISPLAY` environment variable can be set to the index of the display that windows should be created on.

## Developing

Check out this git repository.

Install dependencies from NPM:

    npm install

Start the developer, concurrently running 2x webpack and electron:

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
