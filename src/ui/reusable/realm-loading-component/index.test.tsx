import * as assert from 'assert';
import { DOMWindow, JSDOM } from 'jsdom';
import * as React from 'react';
// @see https://reactjs.org/docs/test-utils.html
// tslint:disable-next-line:no-submodule-imports because this is how their guide sais to load it
import * as ReactTestUtils from 'react-dom/test-utils';
import * as Realm from 'realm';
import { RealmLoadingMode } from '../../../services/ros';
// import { TestRealmObjectServer } from '../../../testing/TestRealmObjectServer';

import {
  IRealmLoadingComponentState,
  RealmLoadingComponent,
} from './RealmLoadingComponent';

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
