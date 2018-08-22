// Initialize the Sentry for early error catching
// This is external to the bundle and will be copied by WebPack to catch any errors that may happen early

import * as Sentry from '@sentry/electron';
import * as electron from 'electron';

const isDevelopment = process.env.NODE_ENV === 'development';

const dsn = 'https://0e6521b5e2c44f6b82e6400a1886a8f5@sentry.io/1226926';
const environment = isDevelopment ? 'development' : 'production';

export const IPC_SEND_EVENT_ID = 'sentry.send-event-id';
export const IPC_EVENT_ID = 'sentry.event-id';

if (process.type === 'renderer') {
  Sentry.init({ dsn, environment });
} else {
  let listeners: Electron.WebContents[] = [];
  Sentry.init({
    dsn,
    environment,
    afterSend: event => {
      // Iterate through the windows waiting for an event id
      for (const webContents of listeners) {
        webContents.send(IPC_EVENT_ID, { id: event.event_id });
      }
      // Reset the list of listeners
      listeners = [];
    },
  });
  // Register a listener for renderer processes asking for the event id
  electron.ipcMain.on(IPC_SEND_EVENT_ID, (event: electron.Event) => {
    listeners.push(event.sender);
  });
}
