import * as electron from 'electron';
import * as fs from 'fs-extra';
import * as path from 'path';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import * as mixpanel from './mixpanel';

const isProduction = process.env.NODE_ENV === 'production';

// Don't report Realm JS analytics data
// @see https://github.com/realm/realm-js/blob/master/lib/submit-analytics.js#L28
process.env.REALM_DISABLE_ANALYTICS = 'true';

// Create and change working directory to aviod conflicts of opening two realms twice
// FIXME: see https://github.com/realm/realm-js/issues/818
// This needs to happen before realm is loaded

// Generating a path for this process
const userDataPath = electron.remote.app.getPath('userData');
const pid = process.pid.toString();
const processDir = path.resolve(userDataPath, `renderer-${pid}`);
// Create the directory
fs.mkdirSync(processDir);
// Change to it
process.chdir(processDir);
// Make sure directory is removed when process / window is closed
window.addEventListener('beforeunload', e => {
  fs.removeSync(processDir);
});

import '../styles/index.scss';

import { getWindow } from './windows/Window';

const appElement = document.getElementById('app');

if (isProduction) {
  const window = getWindow();
  ReactDOM.render(window, appElement);
} else {
  // The react-hot-loader is a dev-dependency, why we cannot use a regular import in the top of this file
  // tslint:disable-next-line:no-var-requires
  const { AppContainer } = require('react-hot-loader');

  const currentWindow = getWindow();
  ReactDOM.render(<AppContainer>{currentWindow}</AppContainer>, appElement);

  // Hot Module Replacement API
  if (module.hot) {
    module.hot.accept('./windows/Window', () => {
      const nextGetWindow = require('./windows/Window').getWindow;
      const nextWindow = nextGetWindow();
      // Render the updated window
      ReactDOM.render(<AppContainer>{nextWindow}</AppContainer>, appElement);
    });
  }

  // Load devtron - if not in production
  // tslint:disable-next-line:no-var-requires
  require('devtron').install();
  // tslint:disable-next-line:no-var-requires
  const devtools = require('electron-devtools-installer');
  devtools.default(devtools.REACT_DEVELOPER_TOOLS).then((name: string) => {
    // tslint:disable-next-line:no-console
    console.warn(`${name} loaded`);
  });
  // Add a tool that will notify us when components update
  if (process.env.WHY_DID_YOU_UPDATE) {
    // tslint:disable-next-line:no-console
    console.warn('Loading why-did-you-update');
    // tslint:disable-next-line:no-var-requires
    const { whyDidYouUpdate } = require('why-did-you-update');
    whyDidYouUpdate(React);
  }
}

// Using process.nextTick - as requiring realm blocks rendering
process.nextTick(() => {
  const Realm = require('realm');
  // If sync is enabled on Realm - make it less verbose
  if (Realm.Sync) {
    Realm.Sync.setLogLevel('error');
  }
});
