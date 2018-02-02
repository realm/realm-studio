const _ = require("lodash");
const path = require("path");
const Visualizer = require('webpack-visualizer-plugin');

module.exports = (env) => {
  const baseConfig = require("./webpack.base.config.js")(env);
  const isProduction = env && env.NODE_ENV === "production";

  return _.merge({}, baseConfig, {
    devServer: isProduction ? {} : {
      hot: true,
      inline: true
    },
    entry: isProduction ? [
      "./src/main.ts",
    ] : [
      "webpack/hot/poll?1000",
      "./src/main.ts"
    ],
    module: {
      rules: baseConfig.module.rules.concat([
        {
          test: /\.tsx?$/,
          use: "awesome-typescript-loader"
        }, {
          test: /\.html$/,
          use: "file-loader"
        }, {
          test: /\.(scss|svg|png)$/,
          use: "null-loader"
        }, {
          test: /\.md$/,
          use: "file-loader"
        }
      ])
    },
    output: {
      filename: "main.bundle.js",
      // See https://github.com/webpack/hot-node-example#real-app
      libraryTarget: "commonjs2"
    },
    plugins: baseConfig.plugins.concat(isProduction ? [] : [
      new Visualizer({
        filename: './main.statistics.html',
      }),
    ]),
    target: "electron-main",
    watch: !isProduction,
  });
};
