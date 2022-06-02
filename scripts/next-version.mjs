import fs from 'fs-extra';
import semver from 'semver';

const releaseNotesPath = new URL('../RELEASENOTES.md', import.meta.url);
const releaseNotes = fs.readFileSync(releaseNotesPath, 'utf8');
const packageJsonPath = new URL('../package.json', import.meta.url);
const packageJson = fs.readJSONSync(packageJsonPath);

if (semver.prerelease(packageJson.version) !== null) {
  console.log('prerelease');
} else {
  const hasBreakingChanges = /### Breaking Changes/.test(releaseNotes);
  const hasNoEnhancements = /### Enhancements\n\n- None/.test(releaseNotes);
  if (hasBreakingChanges) {
    console.log('major');
  } else if (hasNoEnhancements) {
    console.log('patch');
  } else {
    console.log('minor');
  }
}
