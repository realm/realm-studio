#!/usr/bin/env bash

# Let's figure out where this script is located
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# TODO: Consider adding back this to the package.json
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
source $REALM_PATH/dependencies.list

# Build the docker image
docker build -t realm-studio \
  --build-arg PACKAGECLOUD_URL=https://${PACKAGECLOUD_TOKEN}:@packagecloud.io/install/repositories/realm/sync-devel \
  --build-arg REALM_SYNC_VERSION=${REALM_SYNC_VERSION} \
  $DIR

# Build the dependencies for electron
docker run -v $DIR/../..:/src -t realm-studio
