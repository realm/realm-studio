const assert = require("assert");
const program = require("commander");
const octokit = require("@octokit/rest")();
const path = require("path");
const fs = require("fs");

const { wrapCommand } = require("./utils");

const {
  GITHUB_TOKEN,
  GITHUB_OWNER,
  GITHUB_REPO
} = process.env;

assert(GITHUB_TOKEN, "Expected a GITHUB_TOKEN environment variable");
assert(GITHUB_OWNER, "Expected a GITHUB_OWNER environment variable");
assert(GITHUB_REPO, "Expected a GITHUB_REPO environment variable");

// Authenticate
octokit.authenticate({
  type: "token",
  token: GITHUB_TOKEN
});

function determinContentType(assetPath) {
  const ext = path.extname(assetPath);
  if (ext === ".tgz") {
    return "application/tar+gzip"
  } else {
    throw new Error(`Unable to determine content type of ${ext} files`);
  }
}

program
  .command("upload-asset <tag> <asset-path>")
  .action(wrapCommand(async (tag, assetPath) => {
    // Request all releases, as we cannot request by tag name for draft releases
    const { data: releases } = await octokit.repos.listReleases({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
    });
    // Find the release with the right tag name
    const release = releases.find(({ tag_name }) => tag_name === tag);
    if (release) {
      const assetContentType = determinContentType(assetPath);
      const assetContent = fs.readFileSync(assetPath);
      await octokit.repos.uploadReleaseAsset({
        headers: {
          "content-length": assetContent.length,
          "content-type": assetContentType
        },
        url: release.upload_url,
        name: path.basename(assetPath),
        file: assetContent,
      });
    } else {
      throw new Error("Couldn't find the release");
    }
  }));

program
  .command("create-draft <tag> <release notes path>")
  .action(wrapCommand(async (tag, releaseNotesPath) => {
    // Read the content of the release notes
    const releaseNotes = fs.readFileSync(releaseNotesPath, 'utf8');
    // Create a draft release
    await octokit.repos.createRelease({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      tag_name: tag,
      name: `${tag.substring(1)}: ...`,
      body: releaseNotes,
      draft: true
    });
  }));

program
  .command("publish <tag>")
  .action(wrapCommand(async (tag, releaseNotesPath) => {
    // Request all releases, as we cannot request by tag name for draft releases
    const { data: releases } = await octokit.repos.listReleases({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
    });
    // Find the release with the right tag name
    const release = releases.find(({ tag_name }) => tag_name === tag);
    if (release) {
      await octokit.repos.updateRelease({
        owner: GITHUB_OWNER,
        repo: GITHUB_REPO,
        release_id: release.id,
        draft: false,
      });
    } else {
      throw new Error("Couldn't find the release");
    }
  }));

program
  .command("create-pull-request <head> <base> <title>")
  .action(wrapCommand(async (head, base, title) => {
    // Create a pull request
    await octokit.pulls.create({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      title,
      head,
      base,
    });
  }));

program.parse(process.argv);
