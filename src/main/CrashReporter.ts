import { app, crashReporter } from 'electron';

const isProduction = process.env.NODE_ENV === 'production';
const SERVER_URL = isProduction ? '' : '';

export function crashReporterStart(extra: any) {
  const appName = app.getName();
  const currentVersion = app.getVersion();

  crashReporter.start({
    productName: `${appName} - ${currentVersion}`,
    companyName: 'Realm Inc.',
    submitURL: SERVER_URL,
    uploadToServer: true,
    extra,
  });
}
