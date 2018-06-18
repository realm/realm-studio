const merge = require("webpack-merge");

const PLUGIN_BLACKLIST = [
  'SVGSpritePlugin',
  'HotModuleReplacementPlugin',
];

const baseConfig = require("./webpack.base.config.js");

module.exports = (env, argv) => {

  const baseConfig = require("./webpack.base.config.js")(env, argv);

  const config = merge(baseConfig, {
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: "awesome-typescript-loader?silent=true"
        }, {
          test: /\.html$/,
          use: "file-loader"
        }, {
          test: /\.(scss|svg)$/,
          use: "null-loader"
        },
      ],
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
