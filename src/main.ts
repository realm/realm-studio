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

import { app, dialog } from 'electron';

// Loading the fetch API polyfill - so we can use this from the node main process too.
import 'isomorphic-fetch';

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
