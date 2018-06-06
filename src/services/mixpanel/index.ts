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

import * as electron from 'electron';
import * as fs from 'fs-extra';
import * as mixpanel from 'mixpanel-browser';
import * as path from 'path';
import { v4 as uuid } from 'uuid';

import { store } from '../../store';

const isProduction = process.env.NODE_ENV === 'production';

// For official documentation on the config parameters,
// @see https://github.com/mixpanel/mixpanel-js/blob/e10c33badec932badf64cbcc0d0f6165115eeb57/build/mixpanel.globals.js#L2146-L2171
mixpanel.init('bbadd422d2866fc9431cb63baa70bb1a', {
  // Need to explicitly tell mixpanel to user HTTPs, as it's testing agains location.href internally
  api_host: 'https://api.mixpanel.com',
  app_host: 'https://mixpanel.com',
  cdn: 'https://cdn.mxpnl.com',
  // Use test, debug and verbose when not in production
  test: !isProduction,
  debug: !isProduction,
  verbose: !isProduction,
  // Use local storage to persist the users id
  persistence: 'localStorage',
  // As we are currenly transfering credentials in the URLs, lets not send these
  property_blacklist: ['$current_url'],
  // We are tracking "Window opened" instead
  track_pageview: false,
});

mixpanel.disable([
  '$web_event', // This was tracking every click - potentially transfering confirdential data
]);

const browserParams = {
  $browser: 'Realm Studio',
  $browser_version: electron.remote.app.getVersion() || 'unknown',
};

// Sends the browser version on every request
mixpanel.register(browserParams);

const getIdentity = () => {
  // Get the identity from the store
  const identityFromStore = store.get('identity');
  if (identityFromStore) {
    return identityFromStore;
  } else {
    // Try migrating from the old settings
    const settingsPath = path.resolve(
      electron.remote.app.getPath('userData'),
      'settings.json',
    );
    if (fs.existsSync(settingsPath)) {
      const legacySettings = fs.readJsonSync(settingsPath);
      // Delete the legacy settings.json
      fs.removeSync(settingsPath);
      if (legacySettings && legacySettings.identity) {
        store.set('identity', legacySettings.identity);
        return legacySettings.identity;
      } else {
        return null;
      }
    }
  }
};

const getOrCreateIdentity = () => {
  const existingIdentity = getIdentity();
  if (existingIdentity) {
    return existingIdentity;
  } else {
    // Generate a new idendity and store it
    const newIdentity = uuid();
    store.set('identity', newIdentity);
    return newIdentity;
  }
};

const identity = getOrCreateIdentity();
// Tell mixpanel about the identity
mixpanel.identify(identity);
// Update the persons latest browser version
mixpanel.people.set(browserParams);

// Track every click on external links

const linkClickedHandler = (e: MouseEvent) => {
  if (
    e.target instanceof HTMLAnchorElement &&
    e.target.href.indexOf('http') === 0
  ) {
    mixpanel.track('Link clicked', {
      href: e.target.href,
    });
  }
};

document.addEventListener('click', linkClickedHandler);
if (module.hot) {
  module.hot.dispose(() => {
    document.removeEventListener('click', linkClickedHandler);
  });
}

export = mixpanel;
