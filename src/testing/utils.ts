import * as fs from 'fs-extra';
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
  const webpackTestConfig = require('../../webpack.test.config.js')();
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
