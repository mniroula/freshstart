const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: './src/client/index.jsx',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist')
  },
  resolve: {
    modules: ['node_modules', 'src'],
    extensions: ['.js', '.jsx'],
  },
  devServer: {
    historyApiFallback: true,
    port: 3000,
    proxy: {
      '/api': {
        target:'http://api.fsportal.site:5000',
        secure:false,
        changeOrigin:true
      }
    }
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        },
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
            options: {
              modules: true,
              getLocalIdent: (context, localIdentName, localName) => {
                const hash = context.context
                  .split('')
                  .map(v => v.charCodeAt(0))
                  .reduce((a, v) => (a + ((a << 7) + (a << 3))) ^ v)
                  .toString(16);
                return `${localName}__${hash}`;
              },
            },
          },
          {
            loader: 'resolve-url-loader',
            options: {
              join: (fileName, options) => (uri) => { // eslint-disable-line
                if (/^https?:/.test(uri)) return uri;
                return path.join(__dirname, 'src', 'client', 'static', uri);
              },
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
            },
          },
        ],
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader"
          }
        ]
      },
      {
        test: /\.(woff|woff2|otf|ttf|eot|png|jpe?g|svg|gif|glsl)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          outputPath: 'assets/',
          publicPath: 'assets/',
        },
      },
    ],
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: "./src/client/index.html",
      filename: "./index.html"
    }),
    new ExtractTextPlugin('dist/style.css', {
      allChunks: true
    }),
  ]
};