#!/usr/bin/env bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# This will be a docker volume
NODE_MODULES_PATH=realm-studio-node-modules

# Build the image
docker build \
  -t realm-studio-packaging \
  -f $DIR/../Dockerfile.releasing \
  .

# Run the release package
docker run --rm -t \
  --env ELECTRON_CACHE="/root/.cache/electron" \
  --env ELECTRON_BUILDER_CACHE="/root/.cache/electron-builder" \
  -v ~/.cache/electron:/root/.cache/electron \
  -v ~/.cache/electron-builder:/root/.cache/electron-builder \
  -v $DIR/..:/project \
  -v $NODE_MODULES_PATH:/project/node_modules \
  realm-studio-packaging \
  /project/scripts/package-for-linux-windows-inside.sh
