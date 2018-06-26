const { CheckerPlugin } = require('awesome-typescript-loader');
const { resolve } = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const nodeExternals = require('webpack-node-externals');
const webpack = require('webpack');
const SentryPlugin = require('@sentry/webpack-plugin');
const SentryCli = require('@sentry/cli');

const package = require('../package.json');

module.exports = (env, argv) => {
  const isDevelopment = argv.mode === 'development';

  return {
    devtool: isDevelopment ? 'inline-source-map' : 'source-map',
    externals: [
      nodeExternals({
        // Anyting related to webpack, we want to keep in the bundle
        whitelist: [
          /webpack(\/.*)?/,
          'electron-devtools-installer',
          /svg-baker-runtime(\/.*)?/,
          /svg-sprite-loader(\/.*)?/,
        ],
      }),
    ],
    module: {
      rules: []
    },
    node: {
      // This will make __dirname equal the bundles path
      __dirname: false
    },
    output: {
      path: resolve(__dirname, '../build'),
    },
    plugins: [
      // @see https://github.com/s-panferov/awesome-typescript-loader#configuration on why CheckerPlugin is needed
      new CheckerPlugin(),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(
          isDevelopment ? 'development' : 'production'
        ),
      }),
    ].concat(isDevelopment ? [
      // Plugins for development
      new webpack.NamedModulesPlugin(),
      new webpack.HotModuleReplacementPlugin(),
    ] : [
      new UglifyJsPlugin({
        sourceMap: true,
      }),
      new SentryPlugin({
        release: `${package.name}@${package.version}`,
        include: './build',
        ignore: ['node_modules', 'webpack.config.js'],
        configFile: resolve(__dirname, 'sentry.properties'),
        ext: ['map', 'js'],
        urlPrefix: '~/build/',
        dryRun: !process.env.SENTRY_AUTH_TOKEN,
      }),
    ]),
    resolve: {
      alias: {
        'realm-studio-styles': resolve(__dirname, '../styles'),
        'realm-studio-svgs': resolve(__dirname, '../static/svgs'),
        'realm-studio-tutorials': resolve(__dirname, '../tutorials'),
      },
      extensions: ['.ts', '.tsx', '.js', '.jsx', '.html', '.scss', '.svg'],
    },
  };
};
