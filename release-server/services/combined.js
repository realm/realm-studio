const s3 = require('./s3');
const github = require('./github');
const combined = {};

const rootPackage = require('../../package.json');
const s3Config = rootPackage.build.publish.find(publish => publish.provider === 's3');

const deriveVersionFromTag = tag => tag[0] === 'v' ? tag.substring(1) : tag

const listS3Objects = () => {
  return new Promise((resolve, reject) => {
    s3.listObjects({
      Bucket: s3Config.bucket,
      Prefix: s3Config.path
    }, (err, data) => {
      if (err || !data || !data.Contents) {
        reject(err || 'Failed to fetch objects from S3');
      } else {
        resolve(data.Contents);
      }
    });
  });
};

const keyPatterns = (version) => ({
  'mac-dmg': new RegExp(`downloads/realm-studio/Realm Studio-${version}.dmg`),
  'mac-zip': new RegExp(`downloads/realm-studio/Realm Studio-${version}-mac.zip`),
  'win-zip': new RegExp(`downloads/realm-studio/Realm Studio-${version}-win.zip`),
  'win-setup': new RegExp(`downloads/realm-studio/Realm Studio Setup ${version}.exe`),
  'win-standalone': new RegExp(`downloads/realm-studio/Realm Studio ${version}.exe`),
  'linux-appimage': new RegExp(`downloads/realm-studio/realm-studio-${version}-x86_64.AppImage`),
  'linux-tar': new RegExp(`downloads/realm-studio/realm-studio-${version}.tar.gz`)
});

const deriveS3Objects = (release, objects) => {
  // Derive a (non-v-prefixed) version from the release tag
  const version = deriveVersionFromTag(release.tag_name);
  const patterns = keyPatterns(version);
  const result = {};
  // Loop through all objects to find the once that matches this version
  objects.forEach(object => {
    const key = object.Key
    // Loop through the patterns to find relevant objects
    const matchingPatternKey = Object.keys(patterns).find(p => {
      const pattern = patterns[p];
      const match = pattern.exec(key);
      return match;
    });
    // If we found a matching pattern, lets save that in the results
    if (matchingPatternKey) {
      result[matchingPatternKey] = object;
    }
  });
  return result;
};

combined.listReleases = async (includeObjects = false) => {
  // Get the releases from GitHub
  const { data: releases } = await github.repos.getReleases({
    owner: 'realm',
    repo: 'realm-studio'
  });

  if (includeObjects) {
    // Request the artifacts from s3
    const objects = await listS3Objects();
    // Return a combined list
    return releases.map(release => {
      release['s3_objects'] = deriveS3Objects(release, objects);
      return release;
    });
  } else {
    return releases;
  }
};

combined.getRelease = async (tag, includeObjects = false) => {
  // Get the releases from GitHub
  const { data: release } = await github.repos.getReleaseByTag({
    owner: 'realm',
    repo: 'realm-studio',
    tag,
  });

  if (includeObjects) {
    // Request the artifacts from s3
    const objects = await listS3Objects();
    release['s3_objects'] = deriveS3Objects(release, objects);
  }
  return release;
};

module.exports = combined;
