import { Application } from 'spectron';

import { timeout } from '../utils/timeout';

export async function pullAppLogs(app: Application) {
  // Accessing a private property on the Application
  const { chromeDriver } = app as any;
  const { client } = app;
  const lines = [];
  // Pull main and renderer process logs
  if (app.isRunning() && client) {
    const mainLogs = await client.getMainProcessLogs();
    lines.push('——— Main Process Output ———', ...mainLogs);
    const rendererLogs = await client.getRenderProcessLogs();
    lines.push(
      '——— Renderer Process Output ———',
      ...rendererLogs.map(({ level, message }) => `[${level}] ${message}`),
    );
    lines.push('——— End of Output ———');
  } else if (chromeDriver && typeof chromeDriver.getLogs === 'function') {
    // Pull logs from the STDOUT of the Electron app
    lines.push(
      '——— Chrome Driver Output ———',
      ...chromeDriver.getLogs(),
      '——— End of Output ———',
    );
  }
  return lines;
}

export async function startAppWithTimeout(app: Application, ms = 5000) {
  return timeout(
    ms,
    async () => {
      const msg = 'Timed out waiting for application to start';
      const lines = await pullAppLogs(app);
      if (lines.length > 0) {
        return new Error(`${msg}:\n${lines.join('\n')}`);
      } else {
        return new Error(msg);
      }
    },
    app.start(),
  );
}
