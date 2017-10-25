const express = require('express');
const marked = require('marked');
const prettyBytes = require('pretty-bytes');

const combined = require('../services/combined');

const router = express.Router();

const asyncMiddleware = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

const deriveUrl = (object) => {
  return `https://static.realm.io/${object.Key}`;
};

const artifactTypes = {
  'mac-dmg': { title: 'MacOS (Apple Disk Image)' },
  'mac-zip': { title: 'MacOS (Zip archive)' },

  'win-setup': { title: 'Windows (installer)' },
  'win-standalone': { title: 'Windows (standalone)' },
  'win-zip': { title: 'Windows (Zip archive)' },

  'linux-appimage': { title: 'Linux (AppImage)' },
  'linux-tar': { title: 'Linux (Tar archive)' },
};

const getLatestRelease = async () => {
  const releases = await combined.listReleases();
  if (releases && releases.length > 0) {
    return releases[0];
  } else {
    throw new Error('No releases available');
  }
};

router.get('/', asyncMiddleware(async (req, res, next) => {
  const releases = await combined.listReleases();
  res.render('releases', {
    title: 'Realm Studio Releases',
    releases: releases,
  });
}));

router.get('/latest', asyncMiddleware(async (req, res, next) => {
  const latest = await getLatestRelease();
  res.redirect(302, `/${latest.tag_name}`); // Status: Found
}));

router.get('/latest/download/:type', asyncMiddleware(async (req, res, next) => {
  const type = req.params.type;
  const latest = await getLatestRelease();
  res.redirect(302, `/${latest.tag_name}/download/${type}`); // Status: Found
}));

router.get('/:tag', asyncMiddleware(async (req, res, next) => {
  const tag = req.params.tag;
  const release = await combined.getRelease(tag, true);
  Object.keys(release['s3_objects']).forEach(type => {
    const object = release['s3_objects'][type];
    object.prettySize = prettyBytes(object.Size);
  });
  res.render('release', Object.assign(release, {
    title: `Realm Studio ${release.tag_name}`,
    body_html: marked(release.body),
    artifactTypes,
  }));
}));

router.get('/:tag/download/:type', asyncMiddleware(async (req, res, next) => {
  const tag = req.params.tag;
  const type = req.params.type;
  const release = await combined.getRelease(tag, true);
  if (release && type in release['s3_objects']) {
    const object = release['s3_objects'][type];
    const url = deriveUrl(object);
    res.redirect(301, url); // Status: Moved Permanently
  } else {
    throw new Error(`The release ${tag} has no ${type} available for download`);
  }
}));

module.exports = router;
