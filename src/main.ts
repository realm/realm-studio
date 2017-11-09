import { app, dialog } from 'electron';
import * as fs from 'fs-extra';
import * as path from 'path';

import { Application } from './main/Application';

// TODO: Submit these to a service like opbeat instead.
process.on('uncaughtException', error => {
  dialog.showErrorBox('Uncaught exception', `${error.message}: ${error.stack}`);
});

const isProduction = process.env.NODE_ENV === 'production';

// Make node understand the source-maps emitted from WebPack.
if (!isProduction) {
  // We must require this the old fasioned way, as this is a dev dependency that might
  // not be available when the packaged application is shipped, and import statements cannot
  // be used in a block like this.
  // tslint:disable-next-line:no-var-requires
  require('source-map-support').install();
}

Application.sharedApplication.run();
app.on('will-quit', e => {
  Application.sharedApplication.destroy();
});

// Look for changes to application
if (module.hot) {
  module.hot.accept('./main/Application', () => {
    const NewApplication = require('./main/Application').Application;
    NewApplication.sharedApplication.run();
  });
} else if (!isProduction) {
  // tslint:disable-next-line:no-console
  console.warn('Hot module replacement was disabled');
}
