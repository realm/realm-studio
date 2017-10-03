const path = require("path");
const nodeExternals = require("webpack-node-externals");
const webpack = require('webpack');
const { CheckerPlugin } = require("awesome-typescript-loader");
const SpriteLoaderPlugin = require("svg-sprite-loader/plugin");

const isProduction = process.env.NODE_ENV === "production";
// console.log("Running in", isProduction ? "production" : "development", "mode");

const externals = [
  nodeExternals({
    // Anyting related to webpack, we want to keep in the bundle
    whitelist: [
      /webpack(\/.*)?/,
    ]
  }),
];

const node = {
  // This will make __dirname equal the bundles path
  __dirname: false
};

const resolve = {
  alias: {
    "realm-studio-styles": path.resolve(__dirname, "styles"),
    "realm-studio-svgs": path.resolve(__dirname, "static/svgs")
  },
  extensions: [".ts", ".tsx", ".js", ".jsx", ".html", ".scss", ".svg"],
};

const baseConfig = {
  devtool: !isProduction ? "inline-source-map" : false,
  externals,
  module: {
    rules: []
  },
  node,
  output: {
    path: path.resolve(__dirname, "build"),
  },
  plugins: [
    // @see https://github.com/s-panferov/awesome-typescript-loader#configuration on why CheckerPlugin is needed
    new CheckerPlugin(),
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
    }),
    new SpriteLoaderPlugin(),
  ].concat(isProduction ? [
    // Plugins for production
  ] : [
    // Plugins for development
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
  ]),
  resolve
};

module.exports = baseConfig;
