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
import * as path from 'path';
import { Application } from 'spectron';

import * as utils from './utils';

// TODO: Reenable these tests when an update to uglifyjs doesn't yeild
// "Error: Cannot find module './node_modules/uglifyjs-webpack-plugin/dist/uglify/worker.js'"

// We need to disable the next line, to increase the timeout
// tslint:disable-next-line:only-arrow-functions
describe.skip('An application', function() {
  this.timeout(10000);

  let app: Application;

  before(async () => {
    app = await utils.createApp(
      {
        main: path.resolve(__dirname, './sample-app/main.ts'),
        renderer: path.resolve(__dirname, './sample-app/renderer.ts'),
      },
      path.resolve(__dirname, './sample-app/renderer.html'),
    );
  });

  beforeEach(async () => {
    await app.start();
  });

  afterEach(() => {
    return app.stop();
  });

  it('starts', () => {
    assert(app.isRunning);
  });

  it('receives IPC and responds via renderer', async () => {
    assert(app.isRunning);
    await app.client.waitUntilWindowLoaded();

    // Create a promise that resolves when the pong comes back from the renderer
    const responsePromise = new Promise(resolve => {
      app.electron.remote.ipcMain.on(
        'pong',
        ({ response }: { response: string }) => {
          assert(response, 'Hello World!');
          resolve();
        },
      );
    });

    // Send the ping message to the renderer
    app.electron.ipcRenderer.send('ping', {
      greeting: 'Hello',
    });
  });
});
