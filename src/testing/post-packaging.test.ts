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
import * as cp from 'child_process';
import * as fs from 'fs-extra';
import * as http from 'http';
import * as os from 'os';
import * as path from 'path';

import * as mockedS3Server from './mocked-s3-server';

const distPath = path.resolve(__dirname, '../../dist');

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
    'Realm Studio.app/Contents/Resources/app-update.yml',
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
  if (!fs.existsSync(path.resolve(__dirname, 'mocked-realm-studio/dist'))) {
    cp.spawnSync('npx', ['electron-builder', '--mac'], {
      cwd: path.resolve(__dirname, 'mocked-realm-studio'),
      stdio: 'inherit',
    });
  }
}

const describeOnMac = os.platform() === 'darwin' ? describe : describe.skip;

describeOnMac('Realm Studio packaged', () => {
  let mockedS3: http.Server;
  let appProcess: cp.ChildProcess;
  let temporaryMacPath: string;

  before(async function() {
    this.timeout(60000); // It might take a while to package the app ..
    mockedS3 = await mockedS3Server.createServer();
    // Determine the URL of the mocked S3 server
    const mockedS3Url = mockedS3Server.getServerUrl(mockedS3);
    // Build a mocked version of Realm Studio, which we'll attempt an auto-update to
    buildMockedRealmStudio();
    // Copy the current dist/mac folder to a different location to prevent the auto updater
    // from overriding the current dist/mac folder.
    const originalMacPath = path.resolve(distPath, 'mac');
    temporaryMacPath = fs.mkdtempSync(originalMacPath + '-auto-update-test-');
    fs.copySync(originalMacPath, temporaryMacPath);
    // Package the app with the mocked server URL
    changeS3Endpoint(temporaryMacPath, mockedS3Url);
    // Remove any cached version of the mocked Realm Studio
    pruneAutoUpdaterCache();
    // Assemble the app path
    const appPath = path.resolve(
      distPath,
      temporaryMacPath,
      'Realm Studio.app/Contents/MacOS/Realm Studio',
    );
    // Start the app
    appProcess = cp.spawn(appPath, {
      // stdio: "inherit",
      env: {
        REALM_STUDIO_DISABLE_UPDATE_PROMPT: 'true',
      },
    });
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

  it('auto-updates', function(done) {
    this.timeout(30000); // It takes a while to start the app
    const readySignalPath = path.resolve(temporaryMacPath, 'ready.signal');
    let updateCount = 0;
    fs.watchFile(readySignalPath, currentStat => {
      if (updateCount === 0) {
        updateCount++;
        assert.equal(currentStat.size, 0);
      } else if (updateCount === 1) {
        updateCount++;
        const content = fs.readFileSync(readySignalPath, { encoding: 'utf8' });
        assert.equal(content, 'Hello from a future Realm Studio!');
        done();
      }
    });
  });
});
