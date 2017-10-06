const _ = require("lodash");
const path = require("path");
const webpack = require("webpack");

module.exports = (env) => {
  const baseConfig = require("./webpack.base.config.js")(env);
  const isProduction = env && env.NODE_ENV === "production";

  return _.merge({}, baseConfig, {
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
          test: /\.html$/,
          use: "file-loader"
        }, {
          test: /\.scss$/,
          use: [ "style-loader", "css-loader", "resolve-url-loader", "sass-loader?sourceMap" ]
        }, {
          test: /\.svg$/,
          loader: "svg-sprite-loader",
          include: path.resolve(__dirname, "static/svgs"),
          options: {
            extract: true,
            spriteFilename: "sprite.svg"
          }
        }, {
          test: /\.(eot|svg|ttf|woff|woff2)$/,
          exclude: path.resolve(__dirname, "static/svgs"),
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
};
