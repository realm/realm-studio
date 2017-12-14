import * as assert from 'assert';
import * as fs from 'fs';
import * as os from 'os';
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

export const getApplication = (additionalArgs: string[] = []) => {
  // Create a temporary directory for the application to run from
  // const tmpDirPath = os.tmpdir();
  // const userDataDir = fs.mkdtempSync(`${tmpDirPath}/realm-studio-user-data-`);
  const app = new Application({
    path: ELECTRON_PATH,
    args: [MAIN_BUNDLE_PATH, ...additionalArgs],
    // chromeDriverArgs: [`--user-data-dir=${userDataDir}`],
    env: {
      // TODO: Check if this actually has any effects
      ELECTRON_ENABLE_LOGGING: true,
      ELECTRON_ENABLE_STACK_DUMPING: true,
      // Running this without being in production
      NODE_ENV: 'testing',
    },
  });
  return app;
};
