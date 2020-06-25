const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals')

module.exports = {
  entry: {
    app: './src/server.ts',
    vendors: ['phaser']
  },

  target: 'node',

  watch: true,

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
    filename: 'server.bundle.js',
    path: path.resolve(__dirname, '..', 'dist')
  },

  mode: 'development',

  plugins: [
    new webpack.DefinePlugin({
      'typeof CANVAS_RENDERER': JSON.stringify(true),
      'typeof WEBGL_RENDERER': JSON.stringify(true)
    }),
    new webpack.HotModuleReplacementPlugin()
  ],

  externals: [
    nodeExternals({
      whitelist: ['webpack/hot/poll?100'],
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
