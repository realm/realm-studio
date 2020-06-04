const fs = require('fs-extra');
const path = require('path');
const cp = require('child_process');
const semver = require('semver');

const releaseNotesPath = path.resolve(__dirname, '../RELEASENOTES.md');
const releaseNotes = fs.readFileSync(releaseNotesPath, 'utf8');
const packageJsonPath = path.resolve(__dirname, '../package.json')
const packageJson = fs.readJSONSync(packageJsonPath);

if (semver.prerelease(packageJson.version) !== null) {
  console.log('prerelease');
} else {
  const hasBreakingChanges = /## Breaking Changes/.test(releaseNotes);
  const hasNoEnhancements = /## Enhancements\n\n- None/.test(releaseNotes);
  if (hasBreakingChanges) {
    console.log('major');
  } else if (hasNoEnhancements) {
    console.log('patch');
  } else {
    console.log('minor');
  }
}
