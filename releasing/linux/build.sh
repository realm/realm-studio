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

# Build the docker image
docker build -t realm-studio \
  --build-arg PACKAGECLOUD_URL=https://${PACKAGECLOUD_TOKEN}:@packagecloud.io/install/repositories/realm/sync-devel \
  --build-arg REALM_SYNC_VERSION=${REALM_SYNC_VERSION} \
  $DIR

# Build the dependencies for electron
docker run \
  -v $DIR/../..:/src \
  -v realm-studio-node-modules:/src/node_modules \
  -v ~/.cache/electron:/root/.cache/electron \
  -v ~/.cache/electron-builder:/root/.cache/electron-builder \
  -t \
  realm-studio

# -ti --entrypoint=/bin/bash \
