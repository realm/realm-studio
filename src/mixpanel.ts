import * as electron from 'electron';
import * as mixpanel from 'mixpanel-browser';

import * as settings from './settings';

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

settings.getSettings().then(({ identity }) => {
  mixpanel.identify(identity);
});

mixpanel.register({
  $browser: 'Realm Studio (Chrome)',
  realm_studio_version: electron.remote.app.getVersion() || 'unknown',
});

export = mixpanel;
