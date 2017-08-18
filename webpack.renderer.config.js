const _ = require("lodash");

const baseConfig = require("./webpack.base.config.js");

module.exports = _.merge({}, baseConfig, {
  entry: [
    "./src/renderer.tsx",
  ],
  module: {
    rules: baseConfig.module.rules.concat([
      {
        test: /\.tsx?$/,
        use: "awesome-typescript-loader"
      }, {
        test: /\.scss$/,
        use: [ "style-loader", "css-loader", "sass-loader" ]
      }, {
        test: /\.html$/,
        use: "file-loader"
      }
    ])
  },
  output: {
    filename: "renderer.bundle.js"
  },
  target: "electron-renderer"
});
