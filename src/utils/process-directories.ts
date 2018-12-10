////////////////////////////////////////////////////////////////////////////
//
// Copyright 2018 Realm Inc.
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

import * as assert from 'assert';
import * as electron from 'electron';
import * as fs from 'fs-extra';
import { resolve } from 'path';

const app = electron.app || electron.remote.app;
const userDataPath = app.getPath('userData');
const rendererPattern = /^renderer-.+$/;

function changeProcessDirectory(relativePath: string) {
  const path = resolve(userDataPath, relativePath);
  // Remove the directory if it already exists
  if (!fs.existsSync(path)) {
    // Create the directory
    fs.mkdirSync(path);
  }
  // Change to it
  process.chdir(path);
}

export function changeRendererProcessDirectory(type: string) {
  assert.equal(
    process.type,
    'renderer',
    'This should only be called from a renderer process',
  );
  return changeProcessDirectory(`renderer-${type}`);
}

export function changeMainProcessDirectory() {
  assert.equal(
    process.type,
    'browser',
    'This should only be called from a main process',
  );
  return changeProcessDirectory(`main`);
}

export function removeRendererDirectories() {
  const directories = fs
    .readdirSync(userDataPath)
    .filter(name => rendererPattern.test(name))
    .map(name => resolve(userDataPath, name))
    .map(directory => fs.remove(directory));
  return Promise.all(directories);
}
