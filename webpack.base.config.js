const path = require("path");
const nodeExternals = require("webpack-node-externals");
const webpack = require('webpack');
const { CheckerPlugin } = require("awesome-typescript-loader");

const isProduction = process.env.NODE_ENV === "production";

const BUILD_PATH = path.resolve(__dirname, "build");

const externals = [
  nodeExternals()
];

const node = {
  // This will make __dirname equal the bundles path
  __dirname: false
};

const resolve = {
  alias: {
    "realm-studio-styles": path.resolve(__dirname, "styles")
  },
  extensions: [".ts", ".tsx", ".js", ".jsx", "html", ".scss"],
};

const baseConfig = {
  devtool: !isProduction ? "inline-source-map" : false,
  externals,
  module: {
    rules: []
  },
  node,
  output: {
    path: path.resolve(__dirname, "build")
  },
  plugins: [
    // @see https://github.com/s-panferov/awesome-typescript-loader#configuration on why CheckerPlugin is needed
    new CheckerPlugin(),
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV)
    })
  ],
  resolve
};

module.exports = baseConfig;
