import * as assert from 'assert';
import { Application } from 'spectron';

import { getApplication } from './utils';

// We need to disable the next line, to increase the timeout
// tslint:disable-next-line:only-arrow-functions
describe('The signup form', function() {
  this.timeout(10000);

  let app: Application;

  const FORM_SELECTOR = '.Greeting__SignupOverlay form';

  describe('started with --skip-signup', () => {
    before(async () => {
      app = getApplication(['--skip-signup']);
      // Start, clear localStorage and restart
      await app.start();
      await app.client.localStorage('DELETE');
      await app.restart();
    });

    after(async () => {
      await app.stop();
    });

    it('starts', () => {
      assert(app.isRunning());
    });

    it('does not show the signup form', async () => {
      const isVisible = await app.client.isVisible(FORM_SELECTOR);
      assert(!isVisible, 'was not expecting a visible signup form');
    });
  });

  describe('started normally', () => {
    before(async () => {
      app = getApplication();
      // Start, clear localStorage and restart
      await app.start();
      await app.client.localStorage('DELETE');
      await app.restart();
    });

    after(async () => {
      await app.stop();
    });

    it('starts', () => {
      assert(app.isRunning());
    });

    it('shows the signup form', async () => {
      // Await the signup form
      await app.client.waitForVisible(FORM_SELECTOR);
      assert(await app.client.isVisible(FORM_SELECTOR));
      // Enter an email
      await app.client
        .element(FORM_SELECTOR)
        .setValue('#email', 'tester@realm.io');
      // Click the submit button
      await app.client.element(FORM_SELECTOR).click('button');
      // Wait for it to close
      await app.client.waitForVisible(FORM_SELECTOR, undefined, true);
    });
  });
});
