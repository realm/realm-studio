# Guidelines

This is an attempt to provide insights into choices made on code style and tools for the project.
It should be flexible, updated and a topic for discussions.

---

# Versioning and GitHub flow

This project uses [semantic versioning](http://semver.org/)
and [GitHub-flow](http://scottchacon.com/2011/08/31/github-flow.html).

Please choose "Squash and merge" when merging a PR.
It makes it easier to revert a PR and gives a clean commit history on the master branch.

# Linters

This document describes guidelines, some of which can be checked by static code analysis tools called linters.
Specifically this project has configuration files codifying the code-style that we've decided. These can be read and
understood by editors - if the correct plugins have been installed.

If you cannot find editor support for `tslint` and `sass-lint`, run this to test the two respectively

    npm run lint:ts
    npm run lint:sass

Or just run `npm run lint` to run one followed by the other.

Please discuss or create a pull-request if a part of the code-style feels impeding - we can change them if we choose to.

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

The project is currently transpiling TypeScript to ES6.

Besides the syntax-level code styles we should strive to:
- Use interfaces to describe the shape of objects, and strive to avoid using the
  [any](https://www.typescriptlang.org/docs/handbook/basic-types.html#any) type when possible.
- We should generally [avoid using default exports](https://blog.neufund.org/why-we-have-banned-default-exports-and-you-should-do-the-same-d51fdc2cf2ad).
- We should generally strive to use lower-case-with-dashes for folders and filenames, except for React components (see below).

# React

We use [React](https://facebook.github.io/react/) as our primary framework for building the user interface.

We strive to separate components into two categories:
- Presentational components, that ideally has no state and only cares about rendering and importing stylesheets.
- Container components, that wraps presentation components, and holds some application state and defines behaviour by mutating this according to the users interactions.

For more information on the difference between the two, please read
[Dan Abramov's article](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0).

React component files should be named in UpperCamelCase. If the component needs more than a file (because it has other components that it uses internally or because it has styling), we should follow the [component folder pattern](https://medium.com/styled-components/component-folder-pattern-ee42df37ec68):
1. Creating a folder with the same name as the component (still UpperCamelCased), containing an `index.tsx` that exports a class by the same name as the component.
2. The folder should contain all the files needed to render the component as well as any sub-components, that are only used by this particular component.
3. We deviate from the "component folder pattern" as we use TypeScript and name the representational component the same as the component itself (instead of `View`).

At certain levels of the component tree it might make sense to create groups of similar components, we name these folders with a lower-case-with-dashes name. For example the project contains a directory of "reusable" components in `./src/ui/reusable` for components which implements UI that has been used three or more places across the app.

Please see this [example of how to name files and folders](docs/NAMING-EXAMPLE.md).

Use the `classnames` module to conditionally produce a className attribute for components.

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
   `./configs/webpack.main.js`.
2. loaded into the renderer process, which is emitted to `./build/renderer.bundle.js` from the `./src/renderer.ts` entry
   and configured from `./configs/webpack.main.js`.
   Note: We could choose to have more than a single renderer process, but for now - let's differentiate the various
   types of windows from within the renderer source code.

This gives us two undesired effects:

- Stack traces on errors will have references to the transpiled code rather than our original source code, which is why
  we use sourcemaps:
   - By asking webpack to emit sourcemaps in the `./configs/webpack.base.js` with `devtool: "inline-source-map"`
     when we're not in production mode (i.e. building a release version of the app).
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

# SASS

SASS was added to achieve mainly two goals:
- Use a set of variables defining colors, sizes and fonts, which can be imported from the component's stylesheets.
- To import (Bootstrap)[https://getbootstrap.com/] from source, enabling overriding variables with the shared variables.

To make sure one part of the applications styles are not overriding another we use a convention for class names called
[BEM styling](http://getbem.com/introduction/). The dialect we use is a variant of
["hyphernated BEM"](https://csswizardry.com/2013/01/mindbemding-getting-your-head-round-bem-syntax/), which requires
that the first letter of the classname is Uppercase. This is because we use the components to model the BEM blocks and
expect the names to be exactly the same as the class name of the React component that it's styling.

# The "Realm" fonts

We've included the Effra font, aliased as "Realm", but primarily use system fonts to get an experience that feels more
like the users desktop environment.

The Effra font is included in 10 variations of styles and weights which should be referenced by their individual font names
instead of using the font-style and font-weight css parameters.

See https://www.smashingmagazine.com/2013/02/setting-weights-and-styles-at-font-face-declaration/ for more information
on why this is needed.
