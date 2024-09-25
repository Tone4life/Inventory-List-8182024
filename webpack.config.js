const path = require('path');

module.exports = {
  entry: './src/js/index.js', // Your entry JavaScript file
  output: {
    filename: 'bundle.js', // Name of the output bundled file
    path: path.resolve(__dirname, 'dist'), // Output directory for the bundled files
  },
  module: {
    rules: [
      {
        test: /\.css$/, // Regex for CSS files
        use: ['style-loader', 'css-loader'], // Loaders to process CSS files
      },
      {
        test: /\.(js)$/, // Regex for JavaScript files
        exclude: /node_modules/,
        use: 'babel-loader', // If you end up using Babel
      },
    ],
  },
  mode: 'development', // Change to 'production' for minified output
};
