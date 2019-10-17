const fs = require('fs');
const path = require('path');
const cp = require('child_process');

const releaseNotesPath = path.resolve(__dirname, '../RELEASENOTES.md');
const releaseNotes = fs.readFileSync(releaseNotesPath, 'utf8');

const hasBreakingChanges = /## Breaking Changes/.test(releaseNotes);
const hasNoEnhancements = /## Enhancements\n\n\* None/.test(releaseNotes);
if (hasBreakingChanges) {
  console.log('major');
} else if (hasNoEnhancements) {
  console.log('patch');
} else {
  console.log('minor');
}
