# Dependencies

This document will describe known limitations on the dependencies, specifically why some of the packages are not
upgraded to the latest current versions:

## `react` and `react-dom`

These two dependencies (and their @types) is not yet upgraded to version ^16.0.0, because:

1.  `reactstrap` produces peer-dependency warnings in it's latest version (4.8.0):

        npm WARN reactstrap@4.8.0 requires a peer of react@^0.14.9 || ^15.3.0 but none was installed.
        npm WARN reactstrap@4.8.0 requires a peer of react-dom@^0.14.9 || ^15.3.0 but none was installed.

A new (but not officially latest) version of reactstrap exists - that has fixed this.

## `bootstrap`

We're using bootstrap in its alpha version (a 4.0.0-beta exists), because `reactstrap` didn't have a release compatible
with this. Reactstrap now has a @next version which is compatible with bootstrap 4.0.0-beta. This is their instructions
to install.

    npm install --save bootstrap@4.0.0-beta
    npm install --save reactstrap@next react@^16.0.0 react-dom@^16.0.0

After installing the new versions - we need to migrate any components and variables in the styling that was changed
from alpha.6 to the beta version.

## `mocha`

We use `mocha-webpack` to run tests that can load directly from our TS source files (because these may include imports
of stylesheets, images, etc). A new major version (6) of mocha is out, but the newest version of `mocha-webpack`
(2.0.0-beta.0) has a peerDependency on `mocha@>=4 <=5`.
