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

import * as path from 'path';
import { Application } from 'spectron';
import * as webpack from 'webpack';

const ELECTRON_PATH = path.resolve(
  __dirname,
  '../../node_modules/.bin/electron',
);

export const createApp = (
  entries: { [name: string]: string },
  rendererHtmlPath: string,
) => {
  const webpackTestConfig = require('../../config/webpack.test.js')();
  return new Promise<Application>((resolve, reject) => {
    // Compile the .ts file before starting the Spectron app
    webpack(
      {
        ...webpackTestConfig,
        entry: entries,
        output: {
          path: path.resolve(__dirname, '../../.tmp/spectron-webpack'),
        },
      },
      (err, stats) => {
        const compilation = (stats as any).compilation;
        if (err) {
          reject(err);
        } else if (stats.hasErrors()) {
          reject(compilation.errors[0]);
        } else if (!compilation.assets || !compilation.assets['main.js']) {
          reject(new Error("Missing a 'main' entry"));
        } else if (!compilation.assets || !compilation.assets['renderer.js']) {
          reject(new Error("Missing a 'renderer' entry"));
        } else {
          const mainPath = compilation.assets['main.js'].existsAt;
          const rendererPath = compilation.assets['renderer.js'].existsAt;
          const app = new Application({
            path: ELECTRON_PATH,
            args: [mainPath],
            env: {
              RENDERER_HTML_PATH: rendererHtmlPath,
              RENDERER_JS_PATH: rendererPath,
            },
          });
          resolve(app);
        }
      },
    );
  });
};
