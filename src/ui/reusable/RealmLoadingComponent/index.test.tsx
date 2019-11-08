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
import { DOMWindow, JSDOM } from 'jsdom';
import React from 'react';
// @see https://reactjs.org/docs/test-utils.html
// tslint:disable-next-line:no-submodule-imports because this is how their guide sais to load it
import ReactTestUtils from 'react-dom/test-utils';
// import { TestRealmObjectServer } from '../../../testing/TestRealmObjectServer';

import { IRealmLoadingComponentState, RealmLoadingComponent } from './index';

// tslint:disable-next-line:interface-name
interface Global {
  document: Document;
  window: DOMWindow;
}
// This is needed for renderIntoDocument to work
declare var global: Global;

// tslint:disable:max-classes-per-file

describe('<RealmLoadingComponent />', () => {
  before(() => {
    const doc = new JSDOM();
    global.window = doc.window;
    global.document = doc.window.document;
  });

  describe('when subclassed', () => {
    let changes = 0;
    let loads = 0;
    class TestRealmLoadingComponent extends RealmLoadingComponent<
      {},
      IRealmLoadingComponentState
    > {
      public render() {
        return null;
      }

      protected onRealmChanged = () => {
        changes++;
      };

      protected onRealmLoaded = () => {
        loads++;
      };
    }

    it('renders, without loading or changing', () => {
      const element = ReactTestUtils.renderIntoDocument(
        <TestRealmLoadingComponent />,
      );
      assert(element);
      assert.equal(changes, 0, 'Expected no changes');
      assert.equal(loads, 0, 'Expected no loads');
    });
  });

  /*
  describe('when opening the __admin realm of ROS', async () => {
    let server: TestRealmObjectServer;
    let changes = 0;
    let loads = 0;
    let adminUser: Realm.Sync.User;

    before(async () => {
      // Start ROS
      server = new TestRealmObjectServer();
      // login with an admin user
      await server.start();
      // get the admin user
      adminUser = await server.getAdminUser();
    });

    after(async () => {
      await server.shutdown();
    });

    class AdminRealmLoadingComponent extends RealmLoadingComponent<
      {},
      IRealmLoadingComponentState
    > {
      constructor() {
        super();
        this.state = {
          realm: {
            authentication: adminUser,
            mode: RealmLoadingMode.Synced,
            path: '__admin',
          },
          progress: {
            done: false,
          },
        };
      }

      public render() {
        return null;
      }

      protected onRealmChanged = () => {
        changes++;
      };

      protected onRealmLoaded = () => {
        loads++;
      };
    }

    it('renders, without loading or changing', () => {
      const element = ReactTestUtils.renderIntoDocument(
        <AdminRealmLoadingComponent />,
      );
      assert.equal(changes, 0, 'Expected no changes');
      assert.equal(loads, 0, 'Expected no loads');
    });
  });

  after(() => {
    global.window.close();
  });
  */
});
