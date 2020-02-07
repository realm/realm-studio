import { Application } from 'spectron';

import { timeout } from '../utils/timeout';

export async function startAppWithTimeout(app: Application, ms = 5000) {
  return timeout(
    ms,
    () => {
      const msg = 'Timed out waiting for application to start';
      // Accessing a private property on the Application
      const { chromeDriver } = app as any;
      if (chromeDriver && typeof chromeDriver.getLogs === 'function') {
        const logs = chromeDriver.getLogs();
        return new Error(`${msg}:\n${logs.join('\n')}`);
      } else {
        return new Error(msg);
      }
    },
    app.start(),
  );
}
