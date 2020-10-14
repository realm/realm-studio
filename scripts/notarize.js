const fs = require("fs");
const path = require("path");
const { notarize } = require("electron-notarize");

module.exports = async function notarizeApp (context) {
  const { 
    electronPlatformName,
    appOutDir,
    packager: {
      appInfo: {
        productFilename
      }
    }
  } = context;

  // Only notarize the app on MacOS.
  if (electronPlatformName !== "darwin") {
    return;
  }

  console.log("electron-builder.afterSign hook triggered, now running notarizeApp");

  // Options variables
  const appBundleId = "com.mongodb.realm-studio";
  const appPath = path.join(appOutDir, `${productFilename}.app`);
  const appleId = "[APPLE ID PENDING]";
  const appleIdPassword = process.env.GITHUB_ACTION
    ? process.env.APPLE_ID_APP_PASSWORD
    : `@keychain:"Application Loader: ${appleId}"`;
  const ascProvider = "[TEAM PENDING]";
  // TODO: find ascProvider with:
  // /Applications/Transporter.app/Contents/itms/bin/iTMSTransporter -m provider -u APPLE_DEV_ACCOUNT -p APP_PASSWORD

  const options = { appBundleId, appPath, appleId, appleIdPassword, ascProvider };

  // Sanity check
  if (!fs.existsSync(appPath)) {
    throw new Error(`Cannot find application: ${appPath}`);
  }

  // await notarize(options);
  console.log("[SKIPPING] notarization of app! options:", options);

  console.log(`Done notarizing ${appBundleId}`);
};