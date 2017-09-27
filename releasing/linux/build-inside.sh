#!/bin/bash

. $NVM_DIR/nvm.sh

# Make npm rebuild not download realm binaries
export NPM_CONFIG_realm_download_binaries=0

# Installing the package will rebuild dependent binaries for Electron on Linux
npm install

# Rebuild the dependencies for node on Linux - needed if run from a machine that already installed the package.
npm rebuild
