# Releasing for Linux

The app needs its dependencies to be build for electron on Linux, specifically:

- `realm-js` with sync enabled and a feature token injected as an environment variable.

To build the app for linux, run

    PACKAGECLOUD_TOKEN=... ./releasing/linux/build.sh

This will build a centos-6-based docker image that will `npm install`, which will in turn run
`electron-builder install-app-deps`, the image will have realm-sync available, using the same version of sync as
`node_modules/realm` is using and `realm_download_binaries` disabled.

When the `build.sh` script has run the `node_modules/realm/compiled/electron-v1.7_linux_x64` directory will have been
produced and this can be copied to a linux box with a window manager (like Ubuntu 16.04 desktop), that has this
repository checked out, into its `node_modules/realm/compiled` folder.
