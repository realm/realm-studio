const assert = require('assert');
const GitHubApi = require('github');

assert(process.env.GITHUB_TOKEN, "Expected a GITHUB_TOKEN environment variable");

const github = new GitHubApi({
  // debug: process.env.NODE_ENV !== 'production',
});

github.authenticate({
  type: 'token',
  token: process.env.GITHUB_TOKEN
});

module.exports = github;
