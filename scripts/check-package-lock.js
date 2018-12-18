const assert = require('assert');
const semver = require('semver');

const package = require('../package.json');
const packageLock = require('../package-lock.json');

function checkVersion(name, version, lockPackage) {
  assert(
    lockPackage.version === version || semver.satisfies(lockPackage.version, version),
    `Locks version (${lockPackage.version}) of ${name} didn't satisfy the package ${version}`,
  );
}

try {
  assert.equal(package.name, packageLock.name, "Name changed");
  assert.equal(package.version, packageLock.version, "Version changed");
  // Check that all package.json dependencies are semantically compatible with the lock
  Object.keys(package.dependencies).forEach(name => {
    const version = package.dependencies[name];
    // Check if the package exists in the lock
    const lockPackage = packageLock.dependencies[name];
    assert(lockPackage, `"${name}" is missing from the lock`);
    assert(!lockPackage.dev, `"${name}" is now a production dependency`);
    checkVersion(name, version, lockPackage);
  });
  // And the same for the devDependencies
  Object.keys(package.devDependencies).forEach(name => {
    const version = package.devDependencies[name];
    // Check if the package exists in the lock
    const lockPackage = packageLock.dependencies[name];
    assert(lockPackage, `"${name}" is missing from the lock`);
    // We shouldn't check that lockPackage.dev is true - because another production
    // dependency might depend on this package.
    checkVersion(name, version, lockPackage);
  });
} catch(err) {
  if (err instanceof assert.AssertionError) {
    console.error("Package changed, but lock wasn't updated:");
    console.error(err.message);
  } else {
    console.error(err);
  }
  process.exit(-1);
}

console.log("Looking good!");
