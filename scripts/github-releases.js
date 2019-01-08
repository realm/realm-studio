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
  if (assetPath.endsWith('.tgz') || assetPath.endsWith('.tar.gz')) {
    return "application/tar+gzip";
  } else if (assetPath.endsWith('.exe')) {
    return "application/vnd.microsoft.portable-executable";
  } else if (assetPath.endsWith('.zip')) {
    return "application/zip";
  } else if (assetPath.endsWith('.dmg')) {
    return "application/x-apple-diskimage";
  } else if (assetPath.endsWith('.AppImage')) {
    // @see https://cgit.freedesktop.org/xdg/shared-mime-info/commit/?id=01fa61fc002afdcf43f61e7df2d6cc6f6968d8d2
    return "application/x-iso9660-appimage";
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
      if (!assetContentType) {
        // Warn instead of failing
        console.warn(`Unexpected content type: Skipping upload of asset.`);
        return;
      }
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
      name: tag.substring(1),
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
  .option('-a, --assignee [github-handle]', 'Who should be assigned the PR?')
  .option('-r, --reviewer [github-handle]', 'Who should be reviewing the PR?')
  .option('-p, --print-number', 'Should the PR number be printed?')
  .action(wrapCommand(async (head, base, title, { assignee, reviewer, printNumber }) => {
    // Create a pull request
    const pr = await octokit.pulls.create({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      title,
      head,
      base,
    });
    if (reviewer) {
      try {
        await octokit.pulls.createReviewRequest({
          owner: GITHUB_OWNER,
          repo: GITHUB_REPO,
          number: pr.data.number,
          reviewers: [ reviewer ],
        });
      } catch (err) {
        // A failed review request should not fail command.
        console.warn(err.message);
      }
    }
    if (assignee) {
      try {
        await octokit.issues.addAssignees({
          owner: GITHUB_OWNER,
          repo: GITHUB_REPO,
          number: pr.data.number,
          assignees: [ assignee ],
        });
      } catch (err) {
        // A failed assignment should not fail command.
        console.warn(err.message);
      }
    }
    // Print the number if we're asked to
    if (printNumber) {
      console.log(pr.data.number);
    }
  }));

program.parse(process.argv);
