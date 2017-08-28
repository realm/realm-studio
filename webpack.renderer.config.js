const _ = require("lodash");
const path = require("path");
const webpack = require("webpack");

const baseConfig = require("./webpack.base.config.js");

const isProduction = process.env.NODE_ENV === "production";

const entryPrefix = isProduction ? "webpack-dev-server/client?http://localhost:8080/" : "";

module.exports = _.merge({}, baseConfig, {
  devServer: isProduction ? {} : {
    hot: true,
    inline: true
  },
  entry: isProduction ? [
    "./src/renderer.tsx"
  ] : [
    "react-hot-loader/patch",
    "./src/renderer.tsx"
  ],
  module: {
    rules: baseConfig.module.rules.concat([
      {
        test: /\.tsx?$/,
        use: isProduction ? [
          "awesome-typescript-loader"
        ] : [
          "react-hot-loader/webpack",
          "awesome-typescript-loader"
        ],
        // exclude: path.resolve(__dirname, "node_modules"),
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
    filename: "renderer.bundle.js",
    publicPath: isProduction ? "" : "http://localhost:8080/"
  },
  target: "electron-renderer"
});
