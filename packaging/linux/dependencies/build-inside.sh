#!/usr/bin/env bash

# Enable devtoolset-3's gcc
source /opt/rh/devtoolset-3/enable

# Enable NVM
source $NVM_DIR/nvm.sh

# Make npm rebuild not download realm binaries
export NPM_CONFIG_realm_download_binaries=0

# Installing the package will rebuild dependent binaries for Electron on Linux
npm install

# Running dist will first build the app and package the app for Linux
# npm run dist
