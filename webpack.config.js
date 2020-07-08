const CopyPlugin = require('copy-webpack-plugin');

const path = require('path');
module.exports = {
  entry: "./index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "index.js",
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: 'favicon_package_v0.16', to: '' },
        { from: 'index.html', to: '' },
      ],
    }),
  ],
  mode: "production"
};
