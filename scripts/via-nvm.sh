if [[ -z "${NVM_DIR}" ]]; then
  echo "ERROR: Expected a NVM_DIR environment variable"
  exit 1
fi

if [[ -s "$NVM_DIR/nvm.sh" ]]; then
  source "$NVM_DIR/nvm.sh" # This loads nvm
  # Install an use the version from .nvmrx
  nvm install
  # Execute the command passed
  exec $@
else
  echo "ERROR: Expected a nvm.sh script in '$NVM_DIR'"
  exit 2
fi
