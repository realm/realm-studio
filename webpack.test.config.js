const _ = require("lodash");

const baseConfig = require("./webpack.base.config.js");

module.exports = _.merge({}, baseConfig, {
  module: {
    rules: baseConfig.module.rules.concat([
      {
        test: /\.tsx?$/,
        use: "awesome-typescript-loader"
      }, {
        test: /\.html$/,
        use: "file-loader"
      }, {
        test: /\.(scss|svg)$/,
        use: "null-loader"
      }
    ])
  },
  target: "node"
});
