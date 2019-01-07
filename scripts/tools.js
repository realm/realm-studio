const program = require('commander');
const fs = require('fs');
const moment = require('moment');
const path = require('path');
const remark = require('remark');

const changeLogPath = path.resolve(__dirname, '../CHANGELOG.md');
const releaseNotesPath = path.resolve(__dirname, '../RELEASENOTES.md');

program
  .command('copy-release-notes <v1> <v2>')
  .action((previousVersion, nextVersion) => {
    // Read the content of the release notes
    const changeLog = fs.readFileSync(changeLogPath, 'utf8');
    const releaseNotes = fs.readFileSync(releaseNotesPath, 'utf8');
    // Transform the release notes
    const releaseNotesTransformed = releaseNotes
      .replace(/{PREVIOUS_VERSION}/g, previousVersion)
      .replace(/{CURRENT_VERSION}/g, nextVersion);
    // Create a header
    const header = `# Release ${nextVersion.substring(1)} (${moment().format('YYYY-MM-DD')})`;
    // Write back the changelog
    const changeLogTransformed = `${header}\n\n${releaseNotesTransformed}\n\n${changeLog}`;
    fs.writeFileSync(changeLogPath, changeLogTransformed);
  });

program
  .command('extract-release-notes <dest>')
  .action((destinationPath) => {
    // Read the content of the release notes
    const changeLog = fs.readFileSync(changeLogPath, 'utf8');
    // TODO: Parse the markdown and extract the changelog
    const releaseNotes = remark()
      .use(() => {
        return function transformer(tree, file) {
          // Locate the first level 1 headers
          const firstHeaderIndex = tree.children
            .findIndex(n => n.type === 'heading' && n.depth === 1);
          if (firstHeaderIndex === -1) {
            throw new Error("Expected at least one release in the changelog");
          }
          // Locate the second latest level 1 header
          const secondHeaderOffset = tree.children.slice(firstHeaderIndex + 1)
            .findIndex(n => n.type === 'heading' && n.depth === 1);
          // Use undefined (end of array when slicing) if the second heading wasn't found
          const secondHeaderIndex = secondHeaderOffset === -1 ? undefined : firstHeaderIndex + 1 + secondHeaderOffset;
          // The subtree related to the latest release, exluding the depth 1 headers
          const releaseChildren = tree.children.slice(firstHeaderIndex + 1, secondHeaderIndex);
          // Trim out everything internal
          const internalHeaderIndex = releaseChildren
            .findIndex(n => n.type === 'heading' && n.depth === 2 && n.children.find(
              c => c.type === 'text' && c.value === 'Internals'
            ));
          if (internalHeaderIndex === -1) {
            throw new Error("Expected an 'Internals' heading");
          }
          const trimmedReleaseChildren = releaseChildren.slice(0, internalHeaderIndex);
          // Replace the children
          tree.children = trimmedReleaseChildren;
        }
      })
      .processSync(changeLog);
    fs.writeFileSync(destinationPath, releaseNotes);
  });

program.parse(process.argv);
