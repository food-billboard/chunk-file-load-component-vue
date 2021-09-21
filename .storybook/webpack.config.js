const path = require('path');

module.exports = async ({ config, mode }) => {
  config.module.rules.push({
    test: /\.scss$/,
    include: path.resolve(__dirname, '../src'),
    use: ['style-loader', 'css-loader', 'sass-loader'],
  });
  return config;
};

