import * as assert from 'assert';
import * as path from 'path';
import { Application } from 'spectron';

import * as utils from './utils';

// We need to disable the next line, to increase the timeout
// tslint:disable-next-line:only-arrow-functions
describe('An application', function() {
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
