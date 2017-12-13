import * as assert from 'assert';
import { Application } from 'spectron';

import { getApplication } from './utils';

// We need to disable the next line, to increase the timeout
// tslint:disable-next-line:only-arrow-functions
describe('The packaged application', function() {
  this.timeout(10000);

  let app: Application;

  before(() => {
    app = getApplication();
  });

  beforeEach(async () => {
    await app.start();
  });

  afterEach(() => {
    return app.stop();
  });

  it('starts', done => {
    assert(app.isRunning);
    app.webContents.openDevTools();
    setTimeout(done, 5000);
  });
});
