#!/bin/bash

. $NVM_DIR/nvm.sh

# Make npm rebuild not download realm binaries
export NPM_CONFIG_realm_download_binaries=0

npm install
