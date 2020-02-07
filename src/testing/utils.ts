import fs from 'fs';
import { Application } from 'spectron';

import { timeout } from '../utils/timeout';

export async function getChromeDriverLogs(app: Application): Promise<string[]> {
  // Accessing a private property on the Application
  const { chromeDriver } = app as any;
  return chromeDriver && typeof chromeDriver.getLogs === 'function'
    ? chromeDriver.getLogs()
    : [];
}

export async function saveChromeDriverLogs(
  app: Application,
  outputPath: string,
) {
  // Get the log lines from the app
  const lines = await getChromeDriverLogs(app);
  // Write it all to a file
  fs.writeFileSync(outputPath, lines.join('\n'), 'utf8');
}

export async function startAppWithTimeout(app: Application, ms = 5000) {
  return timeout(
    ms,
    new Error('Timed out waiting for application to start'),
    app.start(),
  );
}
