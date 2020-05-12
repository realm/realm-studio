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
import cp from 'child_process';
import fs from 'fs-extra';
import http from 'http';
import os from 'os';
import path from 'path';

import * as mockedS3Server from './mocked-s3-server';

const distPath = path.resolve(__dirname, '../../../dist');

// Extract information from the package.json
const packageJsonPath = path.resolve(__dirname, '../../../package.json');
const packageJson = fs.readJSONSync(packageJsonPath);
const { productName } = packageJson;

/**
 * @see https://github.com/electron-userland/electron-builder/blob/master/packages/electron-updater/src/AppAdapter.ts#L31-L45
 */
function getAutoUpdaterCacheDir(appName: string) {
  const homedir = os.homedir();
  if (process.platform === 'win32') {
    return (
      process.env.LOCALAPPDATA ||
      path.join(homedir, 'AppData', 'Local', appName)
    );
  } else if (process.platform === 'darwin') {
    return path.join(
      homedir,
      'Library',
      'Application Support',
      'Caches',
      appName,
    );
  } else {
    return process.env.XDG_CACHE_HOME || path.join(homedir, '.cache', appName);
  }
}

function pruneAutoUpdaterCache() {
  const cachePath = getAutoUpdaterCacheDir('realm-studio-updater');
  if (fs.existsSync(cachePath)) {
    // console.log(`Pruning auto updater cache ${cachePath}`);
    fs.removeSync(cachePath);
  }
}

function changeS3Endpoint(temporaryMacPath: string, serverUrl: string) {
  const appUpdateYmlPath = path.resolve(
    temporaryMacPath,
    `${productName}.app/Contents/Resources/app-update.yml`,
  );
  const appUpdateYml = fs.readFileSync(appUpdateYmlPath, { encoding: 'utf8' });
  const lines = appUpdateYml.split('\n');
  // Find and overwrite the line defining the endpoint or add a new line
  const endpointLineIndex = lines.findIndex(
    line => line.indexOf('endpoint') === 0,
  );
  const updatedEndpointLine = `endpoint: ${serverUrl}`;
  if (endpointLineIndex === -1) {
    lines.push(updatedEndpointLine);
  } else {
    lines[endpointLineIndex] = updatedEndpointLine;
  }
  // Write back the modified configuration file
  fs.writeFileSync(appUpdateYmlPath, lines.join('\n'), { encoding: 'utf8' });
}

function buildMockedRealmStudio() {
  const mockedRealmStudioPath = path.resolve(__dirname, 'mocked-realm-studio');
  // Install the root projects electron into the node_modules
  if (!fs.existsSync(path.resolve(mockedRealmStudioPath, 'node_modules'))) {
    cp.spawnSync('npm', ['install'], {
      cwd: mockedRealmStudioPath,
      stdio: 'inherit',
    });
  }
  // Build a packaged version of the app
  if (!fs.existsSync(path.resolve(mockedRealmStudioPath, 'dist'))) {
    cp.spawnSync('npx', ['electron-builder', '--mac', '--publish', 'never'], {
      cwd: mockedRealmStudioPath,
      stdio: 'inherit',
    });
  }
}

assert.equal(
  os.platform(),
  'darwin',
  'Currently, the post-package tests can only run on MacOS',
);

assert(
  fs.existsSync(distPath),
  'Build the app before running the post-package tests',
);

assert.equal(typeof productName, 'string', 'Expected a product name');

describe('Realm Studio packaged', () => {
  let mockedS3: http.Server;
  let appProcess: cp.ChildProcess;
  let temporaryMacPath: string;

  before(async function () {
    this.timeout(5 * 60 * 1000); // It might take a while (but no more than 5 minutes) to package the app
    mockedS3 = await mockedS3Server.createServer();
    // Determine the URL of the mocked S3 server
    const mockedS3Url = mockedS3Server.getServerUrl(mockedS3);
    // Build a mocked version of MongoDB Realm Studio, which we'll attempt an auto-update to
    buildMockedRealmStudio();
    // Copy the current dist/mac folder to a different location to prevent the auto updater
    // from overriding the current dist/mac folder.
    const originalMacPath = path.resolve(distPath, 'mac');
    temporaryMacPath = fs.mkdtempSync(originalMacPath + '-auto-update-test-');
    fs.copySync(originalMacPath, temporaryMacPath);
    // Package the app with the mocked server URL
    changeS3Endpoint(temporaryMacPath, mockedS3Url);
    // Remove any cached version of the mocked MongoDB Realm Studio
    pruneAutoUpdaterCache();
  });

  after(() => {
    if (appProcess && !appProcess.killed) {
      appProcess.kill('SIGHUP');
    }
    if (mockedS3 && mockedS3.listening) {
      mockedS3.close();
    }
    // Clean up the temporary dist path
    if (temporaryMacPath) {
      fs.removeSync(temporaryMacPath);
    }
  });

  it('auto-updates', async function () {
    this.timeout(30 * 1000); // It takes a while (~30 seconds) to start the app

    // Assemble the app path
    const appPath = path.resolve(
      distPath,
      temporaryMacPath,
      `${productName}.app/Contents/MacOS/${productName}`,
    );
    // Start the app
    appProcess = cp.spawn(appPath, {
      stdio: 'inherit',
      env: {
        REALM_STUDIO_DISABLE_UPDATE_PROMPT: 'true',
      },
    });

    // Watch for changes to the ready.signal file, indicating that the app got updated successfully
    await new Promise((resolve, reject) => {
      const readySignalPath = path.resolve(temporaryMacPath, 'ready.signal');
      let updateCount = 0;

      appProcess.on('close', code => {
        if (code !== 0) {
          reject(
            new Error(
              `${productName} closed with unexpected exit code (${code})`,
            ),
          );
        }
      });

      function readySignalChanged(currentStat: fs.Stats) {
        if (updateCount === 0) {
          updateCount++;
          assert.equal(currentStat.size, 0);
        } else if (updateCount === 1) {
          updateCount++;
          const content = fs.readFileSync(readySignalPath, {
            encoding: 'utf8',
          });
          assert.equal(content, `Hello from a future ${productName}!`);
          // Stop watching the file
          fs.unwatchFile(readySignalPath, readySignalChanged);
          resolve();
        } else {
          reject(
            new Error(`ready.signal changed unexpectedly (#${updateCount})`),
          );
        }
      }

      // Start watchin gthe ready signal file
      // tslint:disable-next-line:no-console
      console.log(`Awaiting changes to ${readySignalPath}`);
      fs.watchFile(
        readySignalPath,
        { persistent: false, interval: 1000 },
        readySignalChanged,
      );
    });
  });
});
