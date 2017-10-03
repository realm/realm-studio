#!/usr/bin/env bash

# Let's figure out where this script is located
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

IMAGE_TAG=realm-studio-testing

docker build -t $IMAGE_TAG $DIR

docker run --rm -ti \
  --env-file <(env | grep -iE 'DEBUG|NODE_|ELECTRON_|YARN_|NPM_|CI|CIRCLE|TRAVIS|APPVEYOR_|CSC_|GH_|GITHUB_|BT_|AWS_|STRIP|BUILD_') \
  -v ${PWD}:/project \
  -v ${PWD##*/}-node-modules:/project/node_modules \
  -v ~/.cache/electron:/home/realm-studio/.cache/electron \
  -v ~/.cache/electron-builder:/home/realm-studio/.cache/electron-builder \
  -u realm-studio \
  $IMAGE_TAG
