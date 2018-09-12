const merge = require('webpack-merge');

module.exports = (env) => {
  const baseConfig = require('./webpack.base.js')(env, {
    // We need to manually pass-in the mode due to
    // https://github.com/zinserjan/mocha-webpack/pull/225
    mode: process.env.JENKINS_HOME ? 'production' : 'development',
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
  });

  return config;
};
