const CopyWebpackPlugin = require('copy-webpack-plugin');
const _ = require("lodash");
const path = require("path");
const webpack = require("webpack");
const Visualizer = require('webpack-visualizer-plugin');

module.exports = (env) => {
  const baseConfig = require("./webpack.base.config.js")(env);
  const isProduction = env && env.NODE_ENV === "production";

  return _.merge({}, baseConfig, {
    devServer: isProduction ? {} : {
      hot: true,
      inline: true
    },
    entry: "./src/renderer.tsx",
    module: {
      rules: baseConfig.module.rules.concat([
        {
          test: /\.tsx?$/,
          use: "awesome-typescript-loader",
          // exclude: path.resolve(__dirname, "node_modules"),
        }, {
          test: /\.html$/,
          use: "file-loader"
        }, {
          test: /\.scss$/,
          use: [ "style-loader", "css-loader", "resolve-url-loader", "sass-loader?sourceMap" ]
        }, {
          test: /\.(jpe?g|png|gif)$/i,
          use: [ 'file-loader' ],
        }, {
          test: /\.svg$/,
          use: "svg-sprite-loader",
          include: path.resolve(__dirname, "static/svgs")
        }, {
          test: /\.(eot|svg|ttf|woff|woff2)$/,
          use: "file-loader",
          exclude: path.resolve(__dirname, "static/svgs")
        }, {
          test: /\.md$/,
          use: "file-loader"
        }
      ])
    },
    output: {
      filename: "renderer.bundle.js",
      publicPath: isProduction ? "" : "http://localhost:8080/"
    },
    plugins: baseConfig.plugins.concat([
      new CopyWebpackPlugin([
        // Copy the Sentry initialization to the build folder
        './src/sentry.js',
      ]),
    ], isProduction ? [] : [
      new Visualizer({
        filename: './renderer.statistics.html',
      }),
    ]),
    target: "electron-renderer"
  });
};
