import { app, crashReporter } from 'electron';

const isProduction = process.env.NODE_ENV === 'production';
const SERVER_URL = isProduction ? '' : '';

export function crashReporterStart(extra: any) {
  const appName = app.getName();

  crashReporter.start({
    productName: `${appName}`,
    companyName: 'Realm Inc.',
    submitURL: SERVER_URL,
    uploadToServer: true,
    extra,
  });
}
