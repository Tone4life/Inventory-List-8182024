import path from 'path';

export default {
  entry: './client/src/index.js', // Correct path to your entry JavaScript file
  output: {
    filename: 'bundle.js', // Name of the output bundled file
    path: path.resolve('dist'), // Output directory for the bundled files
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
        use: 'babel-loader', // Use Babel loader for JS files
      },
    ],
  },
  mode: 'development', // Change to 'production' for minified output
};
