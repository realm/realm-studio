const _ = require("lodash");

const baseConfig = require("./webpack.base.config.js");

module.exports = _.merge({}, baseConfig, {
  entry: [
    "./src/main.ts",
  ],
  module: {
    rules: baseConfig.module.rules.concat([
      {
        test: /\.tsx?$/,
        use: "awesome-typescript-loader"
      }, {
        test: /\.scss$/,
        use: "null-loader"
      }, {
        test: /\.html$/,
        use: "file-loader"
      }
    ])
  },
  output: {
    filename: "main.bundle.js"
  },
  target: "electron-main"
});
