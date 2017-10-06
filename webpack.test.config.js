const _ = require("lodash");

const PLUGIN_BLACKLIST = [
  'SVGSpritePlugin',
  'HotModuleReplacementPlugin',
];

module.exports = (env) => {
  const baseConfig = require("./webpack.base.config.js")(env);
  const isProduction = env && env.NODE_ENV === "production";

  const config = _.merge({}, baseConfig, {
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

  config.plugins = baseConfig.plugins.filter(plugin => {
    return PLUGIN_BLACKLIST.indexOf(plugin.constructor.name) === -1;
  });

  return config;
};
