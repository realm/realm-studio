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
  const appleId = process.env.APPLE_ID_APP_USERNAME;
  const appleIdPassword = process.env.APPLE_ID_APP_PASSWORD;
  const ascProvider = "QX5CR2FTN2";

  const options = { appBundleId, appPath, appleId, appleIdPassword, ascProvider };

  // Sanity check
  if (!fs.existsSync(appPath)) {
    throw new Error(`Cannot find application: ${appPath}`);
  }

  await notarize(options);

  console.log(`Done notarizing ${appBundleId}`);
};