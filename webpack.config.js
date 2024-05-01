const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {
    popup: './content_scripts/popup.js',
    confetti: './content_scripts/confetti.js'
  },
  output: {
    filename: '[name].bundle.js',
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
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'popup.bundle.html', 
      template: './content_scripts/popup.html',
      chunks: ['popup']
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: 'images', to: 'images' }
      ],
    }),
  ]
};





// const path = require('path');
// const CopyWebpackPlugin = require('copy-webpack-plugin');

// module.exports = {
//   entry: './content_scripts/confetti.js',
//   output: {
//     filename: 'confetti.bundle.js',
//     path: path.resolve(__dirname, 'dist'),
//   },
//   module: {
//     rules: [
//       {
//         test: /\.m?js$/,
//         exclude: /(node_modules|bower_components)/,
//         use: {
//           loader: 'babel-loader',
//           options: {
//             presets: ['@babel/preset-env']
//           }
//         }
//       }
//     ]
//   },
//   plugins: [
//     new CopyWebpackPlugin({
//       patterns: [
//         { from: 'images', to: 'images' }, // copies all images from `src/images` to `dist/images`
//         { from: 'content_scripts/popup.html', to: '.' },  // copies `popup.html` to `dist`
//         { from: 'content_scripts/popup.js', to: '.' },     // copies `popup.js` to `dist`
//         { from: 'content_scripts/popup.css', to: '.' },     // copies `popup.css` to `dist`
//         { from: 'node_modules/bootstrap', to: 'node_modules/bootstrap' }     // copies node `bootstrap` to `dist/node_modules/bootstrap`
//       ],
//     }),
//   ],
// };