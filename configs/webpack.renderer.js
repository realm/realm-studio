const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');
const webpack = require('webpack');
const Visualizer = require('webpack-visualizer-plugin');
const merge = require('webpack-merge');

module.exports = (env, argv) => {
  const isDevelopment = argv.mode === 'development';

  const baseConfig = require('./webpack.base.js')(env, argv);

  return merge(baseConfig, {
    devServer: isDevelopment ? {
      hot: true,
      inline: true
    } : {},
    entry: {
      renderer: "./src/renderer.tsx",
      sentry: "./src/sentry.ts"
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'awesome-typescript-loader',
        }, {
          test: /\.html$/,
          use: 'file-loader'
        }, {
          test: /\.scss$/,
          use: [ 'style-loader', 'css-loader', 'resolve-url-loader', 'sass-loader?sourceMap' ]
        }, {
          test: /\.(jpe?g|png|gif)$/i,
          use: [ 'file-loader' ],
        }, {
          test: /\.svg$/,
          use: 'svg-sprite-loader',
          include: path.resolve(__dirname, '../static/svgs')
        }, {
          test: /\.(eot|svg|ttf|woff|woff2)$/,
          use: 'file-loader',
          exclude: path.resolve(__dirname, '../static/svgs')
        }, {
          test: /\.md$/,
          use: 'file-loader'
        }
      ]
    },
    output: {
      filename: '[name].bundle.js',
      chunkFilename: '[name].renderer.bundle.js',
      publicPath: isDevelopment ? 'http://localhost:8080/' : '',
    },
    plugins: isDevelopment ? [
      new Visualizer({
        filename: './renderer.statistics.html',
      }),
    ] : [],
    target: 'electron-renderer'
  });
};
