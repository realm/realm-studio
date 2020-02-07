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

import assert from 'assert';
import electron from 'electron';
import fs from 'fs-extra';
import { resolve } from 'path';

import { getWindowOptions } from '../windows/WindowOptions';

const app = electron.app || electron.remote.app;
const userDataPath = app.getPath('userData');
const rendererPattern = /^renderer-.+$/;

function changeProcessDirectory(relativePath: string) {
  // Compute the process directory path
  const processDirectoryPath = resolve(userDataPath, relativePath);
  // Ensure the path exists
  fs.ensureDirSync(processDirectoryPath);
  // Change to it
  process.chdir(processDirectoryPath);
}

export function changeRendererProcessDirectory() {
  assert.equal(
    process.type,
    'renderer',
    'This should only be called from a renderer process',
  );
  // Determine the window type from the options passed in through the window.location
  const options = getWindowOptions();
  const type = options.type || 'unknown';
  return changeProcessDirectory(`renderer-${type}`);
}

export function changeMainProcessDirectory() {
  assert.equal(
    process.type,
    'browser',
    'This should only be called from a main process',
  );
  return changeProcessDirectory('main');
}

export function removeRendererDirectories() {
  const directories = fs
    .readdirSync(userDataPath)
    .filter(name => rendererPattern.test(name))
    .map(name => resolve(userDataPath, name))
    .map(directory => fs.remove(directory));
  return Promise.all(directories);
}

// The first time this is imported, it should change directory
if (process.type === 'renderer') {
  changeRendererProcessDirectory();
} else {
  changeMainProcessDirectory();
}
