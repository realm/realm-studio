const _ = require("lodash");

const isProduction = process.env.NODE_ENV === "production";

const baseConfig = require("./webpack.base.config.js");

module.exports = _.merge({}, baseConfig, {
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
        test: /\.(scss|svg)$/,
        use: "null-loader"
      }
    ])
  },
  output: {
    filename: "main.bundle.js",
    // See https://github.com/webpack/hot-node-example#real-app
    libraryTarget: "commonjs2"
  },
  target: "electron-main",
  watch: !isProduction
});
