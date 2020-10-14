const fs = require('fs');
const path = require('path');
const { notarize } = require("electron-notarize");

module.exports = async function notarizeTask () {
  // TODO: remove this
  console.log('notarizeTask should run now');
  return;

  // Only notarize the app on MacOS.
  if (process.platform !== 'darwin') {
    return;
  }

  console.log('electron-builder.afterSign hook triggered, now running notarizeTask', params);

  const appBundleId = "com.mongodb.realm-studio";
  const appPath = path.join(params.appOutDir, `${params.packager.appInfo.productFilename}.app`);
  const appleId = "";
  const appleIdPassword = process.env.GITHUB_ACTION
    ? process.env.APPLE_ID_APP_PASSWORD // must be defined as the environment variable "APPLE_ID_APP_PASSWORD" for GitHub Actions
    : `@keychain:"Application Loader: ${appleId}"`;
  // NOTE: can be found with:
  // /Applications/Transporter.app/Contents/itms/bin/iTMSTransporter -m provider -u APPLE_DEV_ACCOUNT -p APP_PASSWORD
  const ascProvider = "MongoDB Realm";

  if (!fs.existsSync(appPath)) {
    throw new Error(`Cannot find application at: ${appPath}`);
  }

  await notarize({
    appBundleId,
    appPath,
    appleId,
    appleIdPassword,
    ascProvider
  });

  console.log(`Done notarizing ${appId}`);
};