const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const Config = require('./public/config');
const { _ } = require('lodash');

const mtnTitle = 'MTN Business - Selfcare Portal';
const title = 'BMobile BSS Switch';
const { basePath } = Config;
const defaultThemeName = _.get(Config, 'dev.uiConfig.defaultThemecolor', 'azureBlue');
const CSSModuleLoader = {
  loader: 'css-loader',
  options: {
    modules: true,
    localIdentName: '[name]_[local]_[hash:base64:5].css'
  }
};

const CSSLoader = {
  loader: 'css-loader',
  options: {
    modules: false
  }
};

const PostCSSLoader = {
  loader: 'postcss-loader',
  options: {
    ident: 'postcss',
    sourceMap: false, // turned off as causes delay
    plugins: () => [require('autoprefixer')]
  }
};

const config = {
  entry: path.join(__dirname, './src/index.jsx'),
  output: {
    path: path.join(__dirname, './dist'),
    publicPath: basePath
  },
  plugins: [
    new CleanWebpackPlugin(path.join(__dirname, './dist')),
    new CopyPlugin([
      { from: './public/assets/', to: 'assets' },
      { from: './public/config.js', to: 'config.js' },
      { from: './public/manifest.json', to: 'manifest.json' },
      { from: './src/service-worker.js', to: 'service-worker.js' }
    ]),
    new HtmlWebpackPlugin({
      basePath,
      title: `${defaultThemeName === 'mtnYellow' ? mtnTitle : title}`,
      // title: `DMLD ${version}`,
      favicon: `./public/assets/images/${defaultThemeName === 'mtnYellow' ? 'mtn_logo_header.jpg' : 'favicon.ico'}`,
      //favicon: './public/assets/images/favicon.ico',
      template: path.join(__dirname, 'public/index.html')
    }),
    new webpack.DefinePlugin({
      __BASE_PATH__: JSON.stringify(basePath)
    })
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules|bower_components)/,
        use: ['babel-loader'],
        include: path.resolve(__dirname, 'src')
      },
      {
        test: /\.json$/,
        loader: 'json-loader',
        type: 'javascript/auto'
      },
      // {
      //   test: /\.json$/,
      //   loader: '@lingui/loader',
      //   type: 'javascript/auto',
      // },
      // Opt-in support for SASS (using .scss or .sass extensions).
      // Chains the sass-loader with the css-loader and the style-loader
      // to immediately apply all styles to the DOM.
      // By default we support SASS Modules with the
      // extensions .module.scss or .module.sass
      {
        test: /\.(sa|sc|c)ss$/,
        exclude: /\.module\.(sa|sc|c)ss$/,
        use: [MiniCssExtractPlugin.loader, CSSLoader, PostCSSLoader, 'sass-loader']
      },
      // Adds support for CSS Modules, but using SASS
      // using the extension .module.scss or .module.sass
      {
        test: /\.module\.(sa|sc|c)ss$/,
        use: [MiniCssExtractPlugin.loader, CSSModuleLoader, PostCSSLoader, 'sass-loader']
      },
      {
        test: /\.(jpe?g|png|gif|ico|woff2)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              fallback: 'file-loader',
              name: '[name][md5:hash].[ext]',
              outputPath: 'assets/'
              //publicPath: "/assets/"
            }
          }
        ]
      },
      {
        test: /\.(svg|png|jpe?g|gif)(\?\S*)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 100000,
              //publicPath: "/public/assets/",
              name: '[name].[ext]'
            }
          }
        ]
      },
      {
        test: /\.po$/,
        use: [{ loader: 'json-loader' }, { loader: 'po-gettext-loader' }]
      }
    ]
  },
  resolve: {
    modules: [path.resolve(__dirname, './src'), 'node_modules'],
    extensions: ['*', '.js', '.jsx']
  },
  externals: {
    config: 'DMLD_CONFIG',
    'config.js': 'DMLD_CONFIG'
  }
};

module.exports = {
  config,
  basePath,
  CSSLoader,
  CSSModuleLoader,
  PostCSSLoader
};
