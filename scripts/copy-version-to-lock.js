const fs = require('fs');
const path = require('path');

// Open the package.json
const packageJson = require(path.resolve(__dirname, '../package.json'));

// Open the package-lock.json
const packageLockPath = path.resolve(__dirname, '../package-lock.json');
const packageLockJson = require(packageLockPath);

// Update the version
packageLockJson.version = packageJson.version;

// Write back the package-lock.json
fs.writeFileSync(packageLockPath, JSON.stringify(packageLockJson, null, 2) + "\n");
