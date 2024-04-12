const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './content_scripts/confetti.js',
  output: {
    filename: 'confetti.bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        { from: 'images', to: 'images' }, // copies all images from `src/images` to `dist/images`
        { from: 'content_scripts/popup.html', to: '.' },  // copies `popup.html` to `dist`
        { from: 'content_scripts/popup.js', to: '.' },     // copies `popup.js` to `dist`
        { from: 'content_scripts/popup.css', to: '.' }     // copies `popup.css` to `dist`
      ],
    }),
  ],
};