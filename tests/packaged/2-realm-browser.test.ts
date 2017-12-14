import * as assert from 'assert';
import { Application } from 'spectron';

import { getApplication } from './utils';

// We need to disable the next line, to increase the timeout
// tslint:disable-next-line:only-arrow-functions
describe('The packaged application', function() {
  this.timeout(10000);

  let app: Application;

  before(async () => {
    app = getApplication(['--skip-signup']);
    await app.start();
  });

  after(() => {
    return app.stop();
  });

  it('starts', () => {
    assert(app.isRunning());
  });

  describe('opening a local Realm', async () => {
    before(async () => {
      const title = await app.client.getText('.Greeting__Title');
      assert.equal(title, 'Realm Studio');
      // Open a local Realm
      // app.client.click('button=Open a local Realm');
      // TODO: Find a way to select the file from the open dialog
    });

    it.skip('opens the Realm Browser', () => {
      //
    });
  });
});
