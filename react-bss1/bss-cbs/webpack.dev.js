const path = require('path');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const config = merge.smart(common.config, {
  mode: 'development',
  devtool: 'eval-source-map',
  output: {
    filename: 'js/[name].js',
    chunkFilename: 'js/[name].chunk.js'
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/[name].css',
      chunkFilename: 'css/[name].chunk.css'
    })
  ],
  module: {
    rules: [
      {
        test: /\.(sa|sc|c)ss$/,
        exclude: /\.module\.(sa|sc|c)ss$/,
        use: [MiniCssExtractPlugin.loader, common.CSSLoader, common.PostCSSLoader, 'sass-loader']
      },
      {
        test: /\.module\.(sa|sc|c)ss$/,
        use: [MiniCssExtractPlugin.loader, common.CSSModuleLoader, common.PostCSSLoader, 'sass-loader']
      }
    ]
  },
  devServer: {
    port: 3000,
    open: true,
    inline: true,
    overlay: true,
    progress: true,
    compress: true,
    writeToDisk: true,
    historyApiFallback: true,
    publicPath: common.basePath,
    contentBase: path.join(__dirname, './dist'),
    openPage: common.basePath.replace(/^\//, ''),
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    proxy: {
      '/api': {
        target: 'http://dclm.cluster1.devtestlab2.tecnotree.com/',
        pathRewrite: { '^/api': '' },
        headers: {
          Host: 'dclm.cluster1.devtestlab2.tecnotree.com'
        }
      },
      '/middleware': {
        target: 'http://localhost:4000/',
        pathRewrite: { '^/middleware': '' }
      }
    }
  }
});
module.exports = config;
