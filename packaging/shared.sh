#!/usr/bin/env bash

bold=$(tput bold)
normal=$(tput sgr0)

function rs_echo {
  echo
  echo "${bold}[realm-studio]${normal} $1  $2"
  echo
}

# Use the same dependencies as the current version of realm
REALM_PATH=$(dirname $(node -p "require.resolve('realm')"))/..
REALM_DEPENDENCIES_PATH=$REALM_PATH/dependencies.list
if [ ! -f $REALM_DEPENDENCIES_PATH ]; then
    echo "Could not locate the realm-js dependencies.list ($REALM_DEPENDENCIES_PATH)"
    exit 2
fi

source $REALM_DEPENDENCIES_PATH
