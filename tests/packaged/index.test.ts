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
    // TODO: Reset the localStorage
  });

  beforeEach(async () => {
    await app.start();
    // Open the dev tools
    app.webContents.openDevTools();
  });

  afterEach(() => {
    return app.stop();
  });

  it('starts', () => {
    assert(app.isRunning);
  });

  it('shows the signup form', () => {
    const FORM_SELECTOR = '.Greeting__SignupOverlay form';
    app.client.waitForVisible(FORM_SELECTOR);
    app.client.element(FORM_SELECTOR).setValue('#email', 'tester@realm.io');
    app.client.submitForm(FORM_SELECTOR);
  });
});
