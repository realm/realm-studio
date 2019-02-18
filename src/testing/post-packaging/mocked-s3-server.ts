////////////////////////////////////////////////////////////////////////////
//
// Copyright 2018 Realm Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
////////////////////////////////////////////////////////////////////////////

import * as fs from 'fs';
import * as http from 'http';
import * as path from 'path';

const mockedLatestMacYmlPath = path.resolve(
  __dirname,
  'mocked-realm-studio/dist/latest-mac.yml',
);

const mockedRealmStudioZipPath = path.resolve(
  __dirname,
  'mocked-realm-studio/dist/mocked-realm-studio-999.0.0-mac.zip',
);

function sendFile(
  res: http.ServerResponse,
  contentPath: string,
  contentType: string,
) {
  const { size } = fs.statSync(contentPath);
  res.writeHead(200, {
    'Content-Type': contentType,
    'Content-Length': size,
  });
  // Create a read stream
  const readStream = fs.createReadStream(contentPath);
  // We replaced all the event handlers with a simple call to readStream.pipe()
  readStream.pipe(res);
}

function handle(req: http.IncomingMessage, res: http.ServerResponse) {
  const { method, url } = req;
  // tslint:disable-next-line:no-console
  console.log(`Incoming ${method} request for the mocked S3 server on ${url}`);
  if (
    method === 'GET' &&
    url &&
    url.indexOf('/static.realm.io/downloads/realm-studio/latest-mac.yml') === 0
  ) {
    sendFile(res, mockedLatestMacYmlPath, 'application/x-yaml');
  } else if (
    method === 'GET' &&
    url ===
      '/static.realm.io/downloads/realm-studio/mocked-realm-studio-999.0.0-mac.zip'
  ) {
    sendFile(res, mockedRealmStudioZipPath, 'application/zip');
  } else {
    // tslint:disable-next-line:no-console
    console.error(`The mocked S3 server got an unexpected request.`);
    res.writeHead(500);
    res.end();
  }
}

export function getServerUrl(server: http.Server) {
  const address = server.address();
  if (typeof address === 'string') {
    return `http://${address}`;
  } else if (address && typeof address === 'object') {
    return `http://${address.address}:${address.port}`;
  } else {
    throw new Error("Couldn't determine address of the server");
  }
}

export function createServer() {
  return new Promise<http.Server>((resolve, reject) => {
    const server = new http.Server(handle);
    // If an error occurs - reject it
    server.once('error', err => {
      reject(err);
    });
    // Start listening
    server.listen(0, '0.0.0.0', () => {
      resolve(server);
    });
  });
}
