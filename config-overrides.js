/* config-overrides.js */

const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = function override(config, env) {
  let loaders = config.resolve;
  loaders.fallback = {
    stream: require.resolve("stream-browserify"),
    crypto: require.resolve("crypto-browserify"),
  };

  if (!config.plugins) {
    config.plugins = [];
  }

  // Copy ace-builds workers to public folder
  config.plugins.push(
    new CopyWebpackPlugin({
      patterns: [
        {
          from: "node_modules/ace-builds/src-noconflict",
          to: "static/js",
          filter: (resourcePath) => {
            return resourcePath.endsWith(".js");
          },
        },
      ],
    })
  );

  return config;
};
