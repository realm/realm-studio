#!/usr/bin/env bash

# Let's figure out where this script is located
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

source $DIR/../shared.sh

# TODO: To enable sync add this to the package.json
# "npmArgs": [
#   "--realm_enable_sync"
# ],

# Check that the packagecloud token is sat, or exit
if [ -z "$PACKAGECLOUD_TOKEN" ]; then
    echo "Need to set PACKAGECLOUD_TOKEN"
    exit 1
fi

# Create a temporary directory and resolve any symbolic links
# NODE_MODULES_PATH=$(cd `mktemp -d` && pwd -P)
NODE_MODULES_PATH=realm-studio-node-modules
REALM_STUDIO_DEPENDENCIES_TAG=realm-studio-dependencies

rs_echo "🛠" "Building docker image to build dependencies"

# Build the docker image - based on a CentOS 6 image
# We need to build the dependencies in a separate image to get older versions of the libs that
# realm-js (and potentially other libs) are dynamically linking against.
# This will make sure our app can run on systems with a glibc++ older than 3.4.20.
docker build -t $REALM_STUDIO_DEPENDENCIES_TAG \
  --build-arg PACKAGECLOUD_URL=https://${PACKAGECLOUD_TOKEN}:@packagecloud.io/install/repositories/realm/sync-devel \
  --build-arg REALM_SYNC_VERSION=${REALM_SYNC_VERSION} \
  $DIR/dependencies

# Build the dependencies for electron - inside the previous image
rs_echo "⚰️" "Installing the package and building native dependencies inside the old image"
docker run --rm -t \
  -v $DIR/../..:/project \
  -v $NODE_MODULES_PATH:/project/node_modules \
  -v ~/.cache/electron:/root/.cache/electron \
  -v ~/.cache/electron-builder:/root/.cache/electron-builder \
  $REALM_STUDIO_DEPENDENCIES_TAG

# Package up the app for Linux inside the image provided by `electron-builder`
rs_echo "📦" "Packaging up the app for Linux - inside the electron-builder image"
docker run --rm -t \
  -v $DIR/../..:/project \
  -v $NODE_MODULES_PATH:/project/node_modules \
  -v ~/.cache/electron:/root/.cache/electron \
  -v ~/.cache/electron-builder:/root/.cache/electron-builder \
  electronuserland/builder:wine \
  packaging/linux/build-inside.sh

# Clean up - if using a tmp folder
# rm -rf $NODE_MODULES_PATH
rs_echo "🎉" "All done"
