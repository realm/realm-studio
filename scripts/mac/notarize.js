const fs = require("fs");
const path = require("path");
const { notarize } = require("electron-notarize");

const appBundleId = "com.mongodb.realm-studio";
const ascProvider = "QX5CR2FTN2"; // Apple: short team name

exports.notarizeMacApp = async (context) => {
  const { APPLE_ID_APP_USERNAME, APPLE_ID_APP_PASSWORD } = process.env;
  const { 
    electronPlatformName,
    appOutDir,
    packager: {
      appInfo: {
        productFilename
      }
    }
  } = context;

  console.log(`Will now notarize Mac app "${appBundleId}".`);

  // Only notarize the app on MacOS.
  if (electronPlatformName !== "darwin") {
    console.warn(`notarizeMacApp call on non-darwin platform: "${electronPlatformName}". Aborting.`)
    return;
  }

  // Only continue if we have the credentials needed.
  if (!APPLE_ID_APP_USERNAME || !APPLE_ID_APP_PASSWORD) {
    console.warn("No credentials found for notarization, SKIPPING.");
    return;
  }

  // Options variables
  const appPath = path.join(appOutDir, `${productFilename}.app`);
  const appleId = APPLE_ID_APP_USERNAME;
  const appleIdPassword = APPLE_ID_APP_PASSWORD;

  const options = { appBundleId, appPath, appleId, appleIdPassword, ascProvider };

  // Sanity check
  if (!fs.existsSync(appPath)) {
    throw new Error(`File not found: ${appPath}`);
  }

  await notarize(options);

  console.log(`Done notarizing "${appBundleId}".`);
};
