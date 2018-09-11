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
import * as Electron from 'electron';
import * as fs from 'fs';
import { ITest } from 'mocha';
import { resolve } from 'path';
import { Application } from 'spectron';
import * as fakeDialog from 'spectron-fake-dialog';

import {
  create as createAllTypeRealm,
  ITestRealm,
} from '../../testing/all-type-realm';

// When electron is required from Node.js, it returns a string with the path of the electron executable
const electronPath: string = Electron as any;
const appPath = resolve(__dirname, '../../..');

// We need to use a non-arrow functions to adjust the suite timeout
// tslint:disable-next-line:only-arrow-functions
describe('<RealmBrowser /> via Spectron', function() {
  this.timeout(10000);

  let app: Application;
  let realm: ITestRealm;

  before(async () => {
    realm = createAllTypeRealm();
    app = new Application({
      path: electronPath,
      args: [appPath],
      env: { REALM_STUDIO_SKIP_SIGNUP: 'true' },
    });
    // Apply the modifications that will allow us to mock dialogs
    fakeDialog.apply(app);
    // Start the app
    await app.start();
  });

  after(async () => {
    if (app && app.isRunning()) {
      await app.stop();
    }
    if (realm) {
      // Close the Realm file
      realm.closeAndDelete();
    }
  });

  afterEach(async function() {
    if (this.currentTest.state === 'failed') {
      // When a test fails and the app is running, take a screenshot
      const imageBuffer = await app.browserWindow.capturePage();
      fs.writeFileSync('./failure-screenshot.png', imageBuffer);
    }
  });

  describe('opening Realm file', () => {
    before(async () => {
      // Await the Greeting window
      assert.equal(await app.client.getWindowCount(), 1);
      assert.equal(await app.client.getTitle(), 'Realm Studio');
    });

    it('shows the Realm Browser', async () => {
      // Mock the open dialog to return the Realm path
      fakeDialog.mock([
        {
          method: 'showOpenDialog',
          value: [realm.path],
        },
      ]);
      // Click on the button to open a Realm file
      await app.client.click('button=Open Realm file');
      // Wait for the browser window to open and change focus to that
      assert.equal(await app.client.getWindowCount(), 2);
      // Select the browser window
      await app.client.windowByIndex(1);
      // Wait for the left sidebar to exist
      await app.client.waitForExist('span=Classes');
    });

    const classNames = [
      'BoolProperties',
      'CustomClassProperties',
      'DataProperties',
      'DateProperties',
      'DoubleProperties',
      'FloatProperties',
      'IntProperties',
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
          const headerCells = await app.client.elements(
            '.RealmBrowser__Table__HeaderCell',
          );
          // Assert that is has the same number of header cells as it has properties
          // The cell to add a property only has class __HeaderCellControl
          assert.equal(
            headerCells.value.length,
            Object.keys(schema.properties).length,
          );
        });

        it('can create a row of defaults', async () => {
          // Create a row
          await app.client.click(`button=Create ${className}`);
          await app.client.waitForVisible('button=Create');
          await app.client.click('button=Create');
          // Wait for the dialog is no longer open
          await app.client.waitForExist('body:not(.modal-open)');
        });

        // Assert something about the row that was just created

        it('creates a row with of cells', async () => {
          // +1 for the cell below the one that adds a property
          const cells = await app.client.elements('.RealmBrowser__Table__Cell');
          assert.equal(
            cells.value.length,
            Object.keys(schema.properties).length + 1,
          );
        });

        it.skip('can focus and blur each cell', async () => {
          const cells = await app.client.elements('.RealmBrowser__Table__Cell');
          const propertyNames = Object.keys(schema.properties);
          for (const cell of cells.value) {
            // Click the cell
            await app.client.elementIdClick(cell.ELEMENT);
          }
        });
      });
    }
  });
});
