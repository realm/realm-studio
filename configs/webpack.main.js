const path = require('path');
const webpack = require('webpack');
const Visualizer = require('webpack-visualizer-plugin');
const merge = require('webpack-merge');

module.exports = (env, argv) => {
  const isDevelopment = argv.mode === 'development';

  const baseConfig = require('./webpack.base.js')(env, argv);

  return merge(baseConfig, {
    devServer: isDevelopment
      ? {
          hot: true,
          inline: true,
        }
      : {},
    entry: isDevelopment
      ? ['webpack/hot/poll?1000', './src/main.ts']
      : ['./src/main.ts'],
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'awesome-typescript-loader',
        },
        {
          test: /\.html$/,
          use: 'file-loader',
        },
        {
          test: /\.(scss|svg|png)$/,
          use: 'null-loader',
        },
        {
          test: /\.md$/,
          use: 'file-loader',
        },
      ],
    },
    output: {
      filename: 'main.bundle.js',
      // See https://github.com/webpack/hot-node-example#real-app
      libraryTarget: 'commonjs2',
    },
    plugins: [
      // Prevent the windows from loading the UI components
      new webpack.IgnorePlugin(/\/ui/, /\/src\/windows$/),
    ].concat(
      isDevelopment
        ? [
            new Visualizer({
              filename: './main.statistics.html',
            }),
          ]
        : []
    ),
    target: 'electron-main',
    watch: isDevelopment,
  });
};
