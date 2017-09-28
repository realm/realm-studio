#!/usr/bin/env bash



# Let's figure out where this script is located
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# TODO: To enable sync add this to the package.json
# "npmArgs": [
#   "--realm_enable_sync"
# ],

# Check that the packagecloud token is sat, or exit
if [ -z "$PACKAGECLOUD_TOKEN" ]; then
    echo "Need to set PACKAGECLOUD_TOKEN"
    exit 1
fi

# Use the same dependencies as the current version of realm
REALM_PATH=$(dirname $(node -p "require.resolve('realm')"))/..
REALM_DEPENDENCIES_PATH=$REALM_PATH/dependencies.list
if [ ! -f $REALM_DEPENDENCIES_PATH ]; then
    echo "Could not locate the realm-js dependencies.list ($REALM_DEPENDENCIES_PATH)"
    exit 2
fi

source $REALM_DEPENDENCIES_PATH

# Create a temporary directory and resolve any symbolic links
NODE_MODULES_PATH=$(cd `mktemp -d` && pwd -P)
REALM_STUDIO_DEPENDENCIES_TAG=realm-studio-dependencies

# Build the docker image
docker build -t $REALM_STUDIO_DEPENDENCIES_TAG \
  --build-arg PACKAGECLOUD_URL=https://${PACKAGECLOUD_TOKEN}:@packagecloud.io/install/repositories/realm/sync-devel \
  --build-arg REALM_SYNC_VERSION=${REALM_SYNC_VERSION} \
  $DIR/dependencies

# Build the dependencies for electron
docker run --rm -t \
  -v $DIR/../..:/project \
  -v $NODE_MODULES_PATH:/project/node_modules \
  -v ~/.cache/electron:/root/.cache/electron \
  -v ~/.cache/electron-builder:/root/.cache/electron-builder \
  $REALM_STUDIO_DEPENDENCIES_TAG

# Package up the app for Linux in the image provided by `electron-builder`
docker run --rm -t \
  -v $DIR/../..:/project \
  -v $NODE_MODULES_PATH:/project/node_modules \
  -v ~/.cache/electron:/root/.cache/electron \
  -v ~/.cache/electron-builder:/root/.cache/electron-builder \
  electronuserland/builder:wine \
  npm run dist

# Clean up
rm -rf $NODE_MODULES_PATH
