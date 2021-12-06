const path = require('path');
const webpack = require('webpack');
const { merge } = require('webpack-merge');

module.exports = (env, argv) => {
  const isDevelopment = argv.mode === 'development';

  const baseConfig = require('./webpack.base.js')(env, argv);

  return merge(baseConfig, {
    entry: {
      renderer: './src/renderer.tsx',
      sentry: './src/sentry.ts',
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
        },
        {
          test: /\.html$/,
          use: 'file-loader',
        },
        {
          test: /\.scss$/,
          use: [
            'style-loader',
            'css-loader',
            'resolve-url-loader',
            'sass-loader',
          ],
        },
        {
          test: /\.(jpe?g|png|gif)$/i,
          type: 'asset/resource',
        },
        {
          test: /\.svg$/,
          use: 'svg-sprite-loader',
          include: path.resolve(__dirname, '../static/svgs'),
        },
        {
          test: /\.(eot|svg|ttf|woff|woff2)$/,
          type: 'asset/resource',
          exclude: path.resolve(__dirname, '../static/svgs'),
        },
      ],
    },
    output: {
      filename: '[name].bundle.js',
      chunkFilename: '[name].renderer.bundle.js',
      publicPath: isDevelopment ? 'http://localhost:8080/' : '',
    },
    target: 'electron-renderer',
  });
};
