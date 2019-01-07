const program = require("commander");
const fs = require("fs");
const moment = require("moment");
const path = require("path");

const { wrapCommand } = require("./utils");

const changeLogPath = path.resolve(__dirname, '../CHANGELOG.md');
const releaseNotesPath = path.resolve(__dirname, '../RELEASENOTES.md');

program
  .command("copy-release-notes <v1> <v2>")
  .action(wrapCommand(async (previousVersion, nextVersion) => {
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
  }));

program.parse(process.argv);
