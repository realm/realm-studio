# Guidelines

This is an attempt to provide insights into choices made on code style and tools for the project.
It should be flexible, updated and a topic for discussions.

---

# React

We use [React](https://facebook.github.io/react/) as our primary framework for building the user interface.

We strive to separate components into two categories:
- Presentational components, that ideally has no state and only cares about rendering and importing stylesheets.
- Container components that

For more information on the difference between the two, please read
[Dan Abramov's article](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0).

The project contains a directory of "reusable" components in `./src/ui/reusable` for components which implements
UI that has been used three or more places in the app.

Use the `classnames` module to conditionally produce a className attribute for components.

# TypeScript

We use TypeScript (configured from `./tsconfig.json`) as it helps us reason about our code and catch errors at
build-time rather than when the code is running.

To help us make a choice on style when writing typescript and get warnings when we deviate from that choice we've
introduced the use of tslint (configured from `./tslint.json`).

Please make sure that your editor is emitting warnings when your writing code that is not compliant with the TypeScript
flavor of TypeScript that we've chosen. If you don't agree with these - let's change them together.

The only deviations from the recommended rules are:
- `indent`: we are using two spaces (but tslint is currently not warning about this).
- `object-literal-sort-keys`: Keys do not need to be sorted alphabetically.

The project is currently transpiling TypeScript to ES5 due to an issue with the `react-hot-loader` module.
(see the section on "Configuring `react-hot-loader`"). As both Node and Chromium supports almost all of ES6 except the
ES6 modules, this could be changed once the issue is fixed.

Besides the syntax-level code styles we should strive to:
- Use interfaces to describe the shape of objects, and strive to avoid using the
  [any](https://www.typescriptlang.org/docs/handbook/basic-types.html#any) type when possible.

# webpack

webpack was added to achieve mainly two goals:
- Having stylesheets tightly coupled to the components, ideally located in the same folder as components and imported
  from the file which is actually dependent on it (the component´s `.tsx`). This supports a pattern of having style that
  closely relates to the component and can be moved around with the component during a refactoring.
- [Hot Module Replacement](https://webpack.js.org/concepts/hot-module-replacement/) will replace modules in the runtime
  when source code changes. This dramatically increases the developer experience, dropping the time of iteration from
  changing code to seeing the effects from 10 secs (+ key presses and mouse clicks) to ~ 1 sec from change to update.

A side effect of adding webpack is that it bundles together the source code into a single file.

For our project, this is actually two bundles:
1. the main process, emitted to `./build/main.bundle.js` from the `./src/main.ts` entry and configured from
   `./webpack.main.config.js`.
2. loaded into the renderer process, which is emitted to `./build/renderer.bundle.js` from the `./src/renderer.ts` entry
   and configured from `./webpack.main.config.js`.
   Note: We could choose to have more than a single renderer process, but for now - let's differentiate the various
   types of windows from within the renderer source code.

This gives us two undesired effects:

- Stack traces on errors will have references to the transpiled code rather than our original source code, which is why
  we use sourcemaps:
   - By asking webpack to emit sourcemaps in the `./webpack.base.config.js` with `devtool: "inline-source-map"` when
     we're not in production mode (i.e. building a release version of the app).
   - Chromium reads these sourcemaps and translates references, but Node does not automatically, which is why we've
     introduced the [source-map-support](http://npmjs.com/package/source-map-support) package, which is installed in
     `./main.ts`.
- The code from `./node_modules` is pulled in and included in the bundle, which is not desirable or needed as both the
  main and renderer processes of Electron has direct access to these modules at runtime. This is why we use the
  [webpack-node-externals](http://npmjs.com/package/webpack-node-externals) package to keep the dependencies external
  from the bundle produced by webpack. This is with the exception of development dependencies as many of these packages
  needs to be bundled into the renderer bundle to make hot module replacement work.

## webpack: TypeScript

## webpack: Hot Module Replacement

### Configuring `react-hot-loader`

It seems that there is a bug in `react-hot-loader` (https://github.com/gaearon/react-hot-loader/issues/457), which
is why we have to target `es5` instead of `es6` in our `tsconfig.json`. The of the proposed solutions on the issue only
this worked. We should probably create a repository reproducing the error.

# SASS

SASS was added to achieve mainly two goals:
- Use a set of variables defining colors, sizes and fonts, which can be imported from the component's stylesheets.
- To import (Bootstrap)[https://getbootstrap.com/] from source, enabling overriding variables with the shared variables.

To make sure one part of the applications styles are not overriding another we use a convention for class names called
[BEM styling](https://en.bem.info/methodology/key-concepts/). The dialect we use is a variant of
["hyphernated BEM"](https://csswizardry.com/2013/01/mindbemding-getting-your-head-round-bem-syntax/), which requires
that the first letter of the classname is Uppercase. This is because we use the components to model the BEM blocks and
expect the names to be exactly the same as the class name of the React component that it's styling.

# The "Realm" fonts

We're using the Effra font, aliased as "Realm".

It is included in 10 variations of styles and weights which should be referenced by their individual font names instead
of using the font-style and font-weight css parameters.

See https://www.smashingmagazine.com/2013/02/setting-weights-and-styles-at-font-face-declaration/ for more information
on why this is needed.
