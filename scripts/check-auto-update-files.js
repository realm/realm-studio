// This script reads the latest* files and check if the files they refer to has actually been produced.
const assert = require('assert');
const path = require('path');
const fs = require('fs-extra');
const yaml = require('js-yaml');

const autoUpdatePattern = /^latest.*\.(json|yml)$/;

const distPath = path.resolve(__dirname, '../dist');
const fileNames = fs.readdirSync(distPath);

function readAutoUpdatingFile(fileName) {
  const match = autoUpdatePattern.exec(fileName);
  if (match) {
    const extension = match[1];
    const filePath = path.resolve(distPath, fileName);
    const content = fs.readFileSync(filePath, 'utf-8');
    if (extension === 'yml') {
      return yaml.safeLoad(content);
    } else if (extension === 'json') {
      return JSON.parse(content);
    } else {
      throw new Error(`Unexpected extension ${extension}`);
    }
  } else {
    return null;
  }
}

const packageJson = require(path.resolve(__dirname, '../package.json'));
const packageLockJson = require(path.resolve(__dirname, '../package-lock.json'));

try {
  fileNames.forEach(fileName => {
    const autoUpdateContent = readAutoUpdatingFile(fileName);
    if (autoUpdateContent) {
      // This is one of the auto updating "latest-*" json / yml files

      // 1. Check that the version matches that of the package.json and package-lock.json
      assert.equal(
        autoUpdateContent.version,
        packageJson.version,
        'Expected version to equal that of package.json',
      );
      assert.equal(
        autoUpdateContent.version,
        packageLockJson.version,
        'Expected version to equal that of package-lock.json',
      );

      // 2. Check that the value of any path field matches a file
      if (autoUpdateContent.path) {
        assert(
          fileNames.indexOf(autoUpdateContent.path) >= 0,
          `${fileName}'s path is "${autoUpdateContent.path}" - but the file does not exist`,
        );
      }

      // 3. Check that all of the files references matches a file
      if (Array.isArray(autoUpdateContent.files)) {
        for (const someFile of autoUpdateContent.files) {
          assert(
            fileNames.indexOf(someFile.url) >= 0,
            `${fileName}'s files[].url is "${someFile.url}" - but the file does not exist`,
          );
        }
      }
    }
  });
} catch (err) {
  console.error(err.message);
  process.exit(-1);
} finally {
  process.exit();
}
