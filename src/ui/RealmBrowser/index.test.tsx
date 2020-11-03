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
import Electron from 'electron';
import fs from 'fs-extra';
import path from 'path';
import { Application } from 'spectron';
import fakeDialog from 'spectron-fake-dialog';

import { ITestRealm } from '../../testing';
import { create as createAllTypeRealm } from '../../testing/all-type-realm';
import { create as createEncryptedRealm } from "../../testing/encrypted-realm";
import { saveChromeDriverLogs, startAppWithTimeout } from '../../testing/utils';

const APP_START_TIMEOUT = 15000; // 15 sec
const TOTAL_TIMEOUT = APP_START_TIMEOUT + 15000; // 30 sec

// When electron is required from Node.js, it returns a string with the path of the electron executable
const electronPath: string = Electron as any;
const appPath = path.resolve(__dirname, '../../..');

const selectors = {
  cell: '.RealmBrowser__Table__Cell',
  headerCell: '.RealmBrowser__Table__HeaderCell',
};

const isAppBuilt = fs.existsSync(path.resolve(appPath, 'build'));
const describeIfBuilt = isAppBuilt ? describe : describe.skip;

// We need to use a non-arrow functions to adjust the suite timeout
// tslint:disable-next-line:only-arrow-functions
describeIfBuilt('<RealmBrowser /> via Spectron', function() {
  this.timeout(TOTAL_TIMEOUT); // 15 sec

  let app: Application;
  let failureCount = 0;

  before(async () => {
    app = new Application({
      path: electronPath,
      // Requiring in the "log-error-messages.js" script to capture error messages via STDOUT
      args: ['-r', './scripts/log-error-messages.js', appPath],
      env: { REALM_STUDIO_SKIP_SIGNUP: 'true' },
    });
    // Apply the modifications that will allow us to mock dialogs
    fakeDialog.apply(app);
    // Starts the app and prints STDOUT on timeouts
    await startAppWithTimeout(app, APP_START_TIMEOUT);
  });

  afterEach(async function() {
    if (
      this.currentTest &&
      this.currentTest.state === 'failed' &&
      app.isRunning()
    ) {
      const lines = await app.client.getMainProcessLogs();
      for (const line of lines) {
        // tslint:disable-next-line:no-console
        console.error(line);
      }
      // When a test fails and the app is running, take a screenshot
      const image = await app.browserWindow.capturePage();
      if (image instanceof Buffer) {
        // It seems Electron 8.1.1 is actually returning a buffer instead of a NativeImage as the types suggests
        fs.writeFileSync(`./failure-${failureCount}.png`, image);
      } else {
        fs.writeFileSync(`./failure-${failureCount}.png`, image.toPNG());
      }
      failureCount++;
    }
  });

  after(async () => {
    if (typeof process.env.SPECTRON_LOG_FILE === 'string') {
      // Save the STDOUT of the electron process
      await saveChromeDriverLogs(app, process.env.SPECTRON_LOG_FILE);
    }
    // Stop the application if its running
    if (app.isRunning()) {
      await app.stop();
    }
  });

  describe('opening Realm file', () => {
    let realm: ITestRealm;

    before(async () => {
      // Create the all type realm
      realm = createAllTypeRealm();
      // Await the Greeting window
      assert.strictEqual(await app.client.getWindowCount(), 1);
      assert.strictEqual(await app.client.getTitle(), 'Realm Studio');
      // Mock the open dialog to return the Realm path
      fakeDialog.mock([
        {
          method: 'showOpenDialog',
          value: { filePaths: [realm.path] },
        },
      ]);
      // Click on the button to open a Realm file
      await app.client.click('button=Open Realm file');
      // Select the browser window
      await app.client.windowByIndex(1);
    });

    after(() => {
      if (realm) {
        // Close the Realm file
        realm.closeAndDelete();
      }
    });

    it('shows the Realm Browser', async () => {
      // Wait for the browser window to open and change focus to that
      assert.strictEqual(await app.client.getWindowCount(), 2);
      // Wait for the left sidebar to exist
      await app.client.waitForExist('span=Classes');
    });

    const classNames = [
      'BoolProperties',
      'CustomClassProperties',
      'DataProperties',
      'DateProperties',
      'Decimal128Properties',
      'DoubleProperties',
      'FloatProperties',
      'IntProperties',
      'ObjectIdProperties',
      'StringProperties',
    ];

    for (const className of classNames) {
      describe(`changing focus to ${className}`, () => {
        let schema: Realm.ObjectSchema;

        before(async () => {
          // Click the class in the sidebar
          await app.client.click(`span=${className}`);
          const objectSchema = realm.schema.find(s => s.name === className);
          assert(objectSchema, `${className} is missing from the schema`);
          schema = objectSchema as Realm.ObjectSchema;
        });

        it('has header cells', async () => {
          // Assert something about the header
          const headerCells = await app.client.elements(selectors.headerCell);
          // Assert that is has the same number of header cells as it has properties
          assert.strictEqual(
            headerCells.value.length,
            Object.keys(schema.properties).length,
          );
        });

        describe(`creating ${className} of defaults`, () => {
          before(async () => {
            // Expect no cells
            const cells = await app.client.elements(selectors.cell);
            assert.strictEqual(cells.value.length, 0);
            // Create a row
            await app.client.click(`button=Create ${className}`);
            await app.client.waitForVisible('button=Create');
            await app.client.click('button=Create');
            // Wait for the dialog is no longer open
            await app.client.waitForExist('body:not(.modal-open)');
          });

          // Assert something about the row that was just created
          it('creates a row in the table', async () => {
            const cells = await app.client.elements(selectors.cell);
            assert.strictEqual(
              cells.value.length,
              Object.keys(schema.properties).length,
            );
          });

          it.skip('can focus and blur each cell', async () => {
            const cells = await app.client.elements(selectors.cell);
            // const propertyNames = Object.keys(schema.properties);
            for (const cell of cells.value) {
              // Click the cell
              await app.client.elementIdClick(cell.ELEMENT);
            }
          });
        });
      });
    }
  });

  describe('opening an encrypted Realm file', () => {
    // A 64 byte sequence of hex encoded randomness
    const key = "5C8B54D92223310B4D531EA1F1BBEDEC199F2052DF44EEBD7F0935418671B61F197C6A8CFA7ECDE821C5592E52D74EFC22495B8D1E2866155C9CC469A1D9E876";
    let realm: ITestRealm;

    before(async () => {
      // Create the all type realm
      realm = createEncryptedRealm(key);
      // Close it right away, since sharing encrypted realms between processes are not supported yet
      realm.close();
      // Await the Greeting window
      assert.strictEqual(await app.client.getWindowCount(), 1);
      assert.strictEqual(await app.client.getTitle(), 'Realm Studio');
      // Mock the open dialog to return the Realm path
      fakeDialog.mock([
        {
          method: 'showOpenDialog',
          value: { filePaths: [realm.path] },
        },
      ]);
      // Click on the button to open a Realm file
      await app.client.click('button=Open Realm file');
      // Select the browser window
      await app.client.windowByIndex(1);
    });

    after(() => {
      if (realm) {
        // Close the Realm file
        realm.closeAndDelete();
      }
    });

    it('shows the Realm Browser (with the encryption key modal)', async () => {
      // Wait for the browser window to open and change focus to that
      assert.strictEqual(await app.client.getWindowCount(), 2);
      // Wait for the left sidebar to exist
      await app.client.waitForVisible("h5=The Realm might be encrypted");
    });

    it('entering the key, opens the realm', async () => {
      // Add the key to the input element
      await app.client.addValue("input", key);
      await app.client.click("button=Try again")
      // Wait for the left sidebar to exist
      await app.client.waitForVisible('span=Classes');
      // Ensure the schema can be read
      await app.client.waitForVisible('.LeftSidebar__Class__Name=Item');
    });

  });
});
