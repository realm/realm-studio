const { spawn } = require('child_process');
const assert = require('assert');
const path = require('path');
const fs = require('fs-extra');
const semver = require('semver');

// This script:
// 1. prepares the next release - bumping the minor version of the package.json
// 2. It also checks that this project is targeting a version of Realm JS which is semantically compatible with the
//    newest version - available from NPM.
// 3. Deletes the package-lock.json and runs `npm install` to rebuild it.
// 4. Checks out a new branch called `prepare-vX.Y.Z`, commits the changes, pushes it remote and creates a PR.

// Initialize clients
const PROJECT_PATH = path.resolve(__dirname, '..');
const git = require('simple-git')();

// Determine the path of the package and package lock files
const packageJsonPath = path.resolve(PROJECT_PATH, 'package.json');
const packageLockJsonPath = path.resolve(PROJECT_PATH, 'package-lock.json');

// const REALM_REGISTRY_URL = 'https://registry.npmjs.org/realm';

// Wrapping callbacks in a promise
function promised(callback) {
  return new Promise((resolve, reject) => {
    return callback((err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

function runProcess(command, args) {
  return new Promise((resolve, reject) => {
    const p = spawn(command, args, {
      cwd: PROJECT_PATH,
      shell: true,
      stdio: 'inherit',
    });
    p.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        const err = new Error(`Failed when running "${command} ${args.join(' ')}"`);
        reject(err);
      }
    });
  })
}

// Assert that no files has been modified
async function checkHasModifiedFiles() {
  const status = await promised(callback => git.status(callback));
  assert.equal(status.modified.length, 0, 'Please stash modified files before running this');
}

async function updateDependencies() {
  await runProcess('npm', ['update', '--save']);
  try {
    console.log('Consider upgrading these packages:');
    await runProcess('npm', ['outdated', '--depth=0']);
  } catch(err) {
    // Expecting a failure - when packages are outdated
  }
}

function getNextVersion() {
  // Read the package
  const packageJson = require(packageJsonPath);
  return semver.inc(packageJson.version, 'minor');
}

async function writeVersion(nextVersion) {
  // Read the two files
  const packageJson = require(packageJsonPath);
  const packageLockJson = require(packageLockJsonPath);
  // Override the version
  const nextPackageJson = {
    ...packageJson,
    version: nextVersion,
  };
  const nextPackageLockJson = {
    ...packageLockJson,
    version: nextVersion,
  };
  // Write back the two files
  fs.writeFileSync(packageJsonPath, JSON.stringify(nextPackageJson, undefined, 2) + "\n");
  fs.writeFileSync(packageLockJsonPath, JSON.stringify(nextPackageLockJson, undefined, 2) + "\n");
  // And the package lock json
  console.log(`Bumped version to ${nextVersion} - saved package.json and package-lock.json`);
}

async function createBranch(nextVersion) {
  const branchName = `prepare-${nextVersion}`;
  // Create the branch - it will fail if it already exists
  await promised(callback => git.checkoutBranch(branchName, 'master', callback));
}

// The main script that runs
async function run() {
  await checkHasModifiedFiles();
  nextVersion = getNextVersion();
  await createBranch(nextVersion);
  await writeVersion(nextVersion);
  await updateDependencies();
}

// Invoke the script and log progress and errors.
run().then(() => {
  console.log("Good bye!");
}, (err) => {
  if (err instanceof assert.AssertionError) {
    console.error(err.message);
  } else {
    console.error(err);
  }
});
