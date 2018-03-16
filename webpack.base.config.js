const path = require("path");
const nodeExternals = require("webpack-node-externals");
const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const { CheckerPlugin } = require("awesome-typescript-loader");

module.exports = (env) => {
  const isProduction = env && env.NODE_ENV === "production";
  // console.log("Running in", isProduction ? "production" : "development", "mode");

  const externals = [
    nodeExternals({
      // Anyting related to webpack, we want to keep in the bundle
      whitelist: [
        /webpack(\/.*)?/,
        'electron-devtools-installer',
        /svg-baker-runtime(\/.*)?/,
        /svg-sprite-loader(\/.*)?/,
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
      "realm-studio-svgs": path.resolve(__dirname, "static/svgs"),
      "realm-studio-tutorials": path.resolve(__dirname, "tutorials"),
    },
    extensions: [".ts", ".tsx", ".js", ".jsx", ".html", ".scss", ".svg"],
  };

  return {
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
        "process.env.NODE_ENV": JSON.stringify(env ? env.NODE_ENV : 'development'),
      }),
    ].concat(isProduction ? [
      new UglifyJsPlugin({
        sourceMap: true,
      }),
    ] : [
      // Plugins for development
      new webpack.NamedModulesPlugin(),
      new webpack.HotModuleReplacementPlugin(),
    ]),
    resolve
  };
};
