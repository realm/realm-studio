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
    // Read the content of the changelog
    const changeLog = fs.readFileSync(changeLogPath, 'utf8');
    // Locate the header of the latest release
    const latestReleaseIndex = changeLog.indexOf('## Release');
    const introduction = changeLog.substring(0, latestReleaseIndex);
    const existingReleases = changeLog.substring(latestReleaseIndex);
    // Read the release notes
    const releaseNotes = fs.readFileSync(releaseNotesPath, 'utf8');
    // Transform the release notes
    const releaseNotesTransformed = releaseNotes
      .replace(/{PREVIOUS_VERSION}/g, previousVersion)
      .replace(/{CURRENT_VERSION}/g, nextVersion);
    // Create a header
    const header = `## Release ${nextVersion.substring(1)} (${moment().format('YYYY-MM-DD')})`;
    // Write back the changelog
    const changeLogTransformed = `${introduction}${header}\n\n${releaseNotesTransformed}\n\n${existingReleases}`;
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
        // Find the index of headers in a list of children
        function findHeadings(children, depth) {
          const result = [];
          // Loop through each child and add the right nodes to the results
          children.forEach((c, index) => {
            if (c.type === 'heading' && c.depth === depth) {
              result.push(index);
            }
          });
          // Return the list of heading indecies
          return result;
        }

        return function transformer(tree, file) {
          const headingsIndex = findHeadings(tree.children, 2);
          if (headingsIndex.length < 1) {
            throw new Error("Expected at least one release in the changelog");
          }
          // The subtree related to the latest release, exluding the depth 1 headers
          const releaseChildren = tree.children.slice(headingsIndex[0] + 1, headingsIndex[1]);
          // Trim out everything internal
          const internalHeaderIndex = releaseChildren
            .findIndex(n => n.type === 'heading' && n.children.find(
              c => c.type === 'text' && c.value === 'Internals'
            ));
          const trimmedReleaseChildren = internalHeaderIndex === -1 ?
            releaseChildren :
            releaseChildren.slice(0, internalHeaderIndex);
          // Replace the children
          tree.children = trimmedReleaseChildren;
        }
      })
      .processSync(changeLog);
    fs.writeFileSync(destinationPath, releaseNotes);
  });

program.parse(process.argv);
