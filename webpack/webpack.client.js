const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {
    app: './src/client.ts',
    vendors: ['phaser']
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },

  devtool: 'inline-source-map',

  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },

  output: {
    filename: 'client.bundle.js',
    path: path.resolve(__dirname, '..', 'dist')
  },

  mode: 'development',

  devServer: {
    contentBase: path.resolve(__dirname, '..', 'dist'),
    port: 8080,
    host: "0.0.0.0",
  },

  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, '..', 'index.html'),
          to: path.resolve(__dirname, '..', 'dist')
        },
        {
          from: path.resolve(__dirname, '..', 'guardian-assets', 'dist', '**', '*'),
          to: path.resolve(__dirname, '..', 'dist')
        }
      ]
    }),
    new webpack.DefinePlugin({
      'typeof CANVAS_RENDERER': JSON.stringify(true),
      'typeof WEBGL_RENDERER': JSON.stringify(true)
    }),
  ],

  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all'
        }
      }
    }
  }
};
