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

const getOrCreateIdentity = () => {
  // Get the identity from the settings file - in case the localStorage was cleared
  const identityFromStore = store.get('identity');
  if (identityFromStore) {
    return identityFromStore;
  } else {
    // Try migrating from the old settings
    const settingsPath = path.resolve(
      electron.remote.app.getPath('userData'),
      'settings.json',
    );
    const legacySettings = fs.existsSync(settingsPath)
      ? fs.readJsonSync(settingsPath)
      : null;
    if (legacySettings && legacySettings.identity) {
      store.set('identity', legacySettings.identity);
      return legacySettings.identity;
    } else {
      // Generate a new idendity
      const newIdentity = uuid();
      store.set('identity', newIdentity);
      return newIdentity;
    }
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
