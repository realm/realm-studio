const _ = require("lodash");

const baseConfig = require("./webpack.base.config.js");

const PLUGIN_BLACKLIST = [
  'SVGSpritePlugin',
  'HotModuleReplacementPlugin',
];

module.exports = _.merge({}, baseConfig, {
  module: {
    rules: baseConfig.module.rules.concat([
      {
        test: /\.tsx?$/,
        use: "awesome-typescript-loader?silent=true"
      }, {
        test: /\.html$/,
        use: "file-loader"
      }, {
        test: /\.(scss|svg)$/,
        use: "null-loader"
      }
    ])
  },
  target: "node",
  node: {
    // This will make __dirname equal the actual file
    __dirname: true,
  },
});

module.exports.plugins = baseConfig.plugins.filter(plugin => {
  return PLUGIN_BLACKLIST.indexOf(plugin.constructor.name) === -1;
});
