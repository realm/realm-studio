import * as assert from 'assert';
import * as fs from 'fs';
import * as path from 'path';
import { Application } from 'spectron';

const PACKAGE_PATH = path.resolve(__dirname, '../..');

const ELECTRON_PATH = path.resolve(PACKAGE_PATH, 'node_modules/.bin/electron');

const PACKAGE_JSON_PATH = path.resolve(PACKAGE_PATH, 'package.json');
const packageJson = JSON.parse(fs.readFileSync(PACKAGE_JSON_PATH, 'utf8'));

// Checking that the main bundle was build
const MAIN_BUNDLE_PATH = path.resolve(PACKAGE_PATH, packageJson.main);
assert(
  fs.existsSync(MAIN_BUNDLE_PATH),
  `Missing the main bundle: ${MAIN_BUNDLE_PATH} - did you run "npm run build"?`,
);

export const getApplication = () => {
  const app = new Application({
    path: ELECTRON_PATH,
    args: [MAIN_BUNDLE_PATH],
  });
  return app;
};
