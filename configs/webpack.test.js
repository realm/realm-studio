const merge = require('webpack-merge');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');

console.log(process.env);

module.exports = (env) => {
  const baseConfig = require('./webpack.base.js')(env, {
    // We need to manually pass-in the mode due to
    // https://github.com/zinserjan/mocha-webpack/pull/225
    mode: 'testing',
  });

  const config = merge(baseConfig, {
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'awesome-typescript-loader?silent=true'
        }, {
          test: /\.html$/,
          use: 'file-loader'
        }, {
          test: /\.(scss|svg)$/,
          use: 'null-loader'
        },
      ],
    },
    target: 'node',
    node: {
      // This will make __dirname equal the actual file
      __dirname: true,
    },
    plugins: process.env.CI ? [
      // None ...
    ] : [
      new HardSourceWebpackPlugin(),
    ]
  });

  return config;
};
