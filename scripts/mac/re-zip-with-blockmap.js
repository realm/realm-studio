// Heavily inspired by https://gist.github.com/harshitsilly/a1bd5a405f93966aad20358ae6c4cec5

const os = require('os');
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const { execSync } = require('child_process');
const { appBuilderPath } = require('app-builder-bin');
const { clearInterval } = require('timers');

const currentWorkingDirectory = process.cwd();
const packageInfo = require(path.join(currentWorkingDirectory, 'package.json'));

const APP_NAME = packageInfo.productName;
const CHANNEL = packageInfo.build.publish[0].channel;
const APP_VERSION = packageInfo.version;
const APP_DIST_PATH = path.join(currentWorkingDirectory, 'dist');

const APP_PATH = `${APP_DIST_PATH}/mac/${APP_NAME}.app`;

if (process.o) {
  
}

if (!fs.existsSync(APP_PATH)) {
  console.log(`App not found at "${APP_PATH}", skipping re-zipping.`);
  return;
}

console.log('Re-zipping started (electron-builder bugs the zip-file).');

execSync(
  `ditto -c -k --sequesterRsrc --keepParent --zlibCompressionLevel 9 "${APP_DIST_PATH}/mac/${APP_NAME}.app" "${APP_DIST_PATH}/${APP_NAME}-${APP_VERSION}-mac.zip"`
);

console.log('Re-zipping completed, updating YAML file with blockmap.');

const APP_GENERATED_BINARY_PATH = path.join(APP_DIST_PATH, `${APP_NAME}-${APP_VERSION}-mac.zip`);

try {
  const output = execSync(
    `${appBuilderPath} blockmap --input="${APP_GENERATED_BINARY_PATH}" --output="${APP_DIST_PATH}/${APP_NAME}-${APP_VERSION}-mac.zip.blockmap" --compression=gzip`
  );

  const { sha512, size } = JSON.parse(output);

  const ymlPath = path.join(APP_DIST_PATH, `${CHANNEL}-mac.yml`);
  const ymlData = yaml.safeLoad(fs.readFileSync(ymlPath, 'utf8'));

  ymlData.sha512 = sha512;
  ymlData.files[0].sha512 = sha512;
  ymlData.files[0].size = size;

  const yamlStr = yaml.safeDump(ymlData);

  fs.writeFileSync(ymlPath, yamlStr, 'utf8');

  console.log('Successfully updated YAML file and configurations with blockmap.');
} catch (err) {
  console.log('Error in updating YAML file and configurations with blockmap.', err);
}
