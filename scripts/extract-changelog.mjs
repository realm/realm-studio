////////////////////////////////////////////////////////////////////////////
//
// Copyright 2022 Realm Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
////////////////////////////////////////////////////////////////////////////

import fs from 'node:fs';

function extractRelease(changelog, expectedVersion) {
  // Inspired by https://github.com/realm/ci-actions/blob/main/update-changelog/src/helpers.ts
  const changelogRegex =
    /^## (?<version>[^\s]+) \((?<date>[^)]+)\)\s+(?<body>.*?)\s+(?=^## )/gms;
  let match;
  while ((match = changelogRegex.exec(changelog))) {
    const release = match.groups;
    if (!expectedVersion || expectedVersion === release.version) {
      return release;
    }
  }
  throw new Error('Unable to extract release');
}

const changelogPath = new URL('../CHANGELOG.md', import.meta.url);
const changelog = fs.readFileSync(changelogPath, { encoding: 'utf8' });
const version = process.argv[2];
const release = extractRelease(changelog, version);
console.log(release.body);
