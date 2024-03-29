const webpack = require('webpack')
const { resolve } = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const webpackMerge = require('webpack-merge')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin')
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')
const BrotliPlugin = require('brotli-webpack-plugin')
const CompressionPlugin = require('compression-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const isProduction = process.env.NODE_ENV === 'production'

const projectRoot = resolve(__dirname)
const sourceFolder = resolve(projectRoot, 'src')
const buildFolder = resolve(projectRoot, 'build')
const distFolder = resolve(projectRoot, 'dist')
const publicFolder = resolve(projectRoot, 'public')
const htmlTemplateFile = resolve(publicFolder, 'index.html')

const babelRule = {
  test: /\.js$|jsx/,
  use: 'babel-loader'
}

const sassRule = {
  test: /\.css|.scss$/,
  use: [
    isProduction
      ? {
        loader: MiniCssExtractPlugin.loader,
        options: {
          hmr: process.env.NODE_ENV === 'development',
          reloadAll: process.env.NODE_ENV === 'development'
        }
      } :
      { loader: 'style-loader', options: {
        insertInto: () => document.querySelector("#id"),
        singleton: true,
      }},
      // Translates CSS into CommonJS
      'css-loader',
      // Compiles Sass to CSS
      'sass-loader',
  ]
}

const baseConfig = {
  mode: 'none',

  context: projectRoot,

  module: {
    rules: [babelRule, sassRule]
  },

  plugins: [
    new CopyWebpackPlugin([
      {
        from: publicFolder,
        ignore: [htmlTemplateFile]
      }
    ])
  ],


}

const devConfig = {
  mode: 'development',

  output: {
    path: distFolder,
    filename: 'js/[name].js',
    publicPath: 'http://localhost:3003/',
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new HtmlWebpackPlugin({
      template: htmlTemplateFile,
      chunksSortMode: 'dependency'
    })
  ],

  devtool: 'inline-source-map',

  resolve: {
    alias: {
      'react-dom': '@hot-loader/react-dom',
    },
  },

  devServer: {
    historyApiFallback: true,
  },

  entry: [
    'react-hot-loader/patch',
    '@babel/polyfill',
    'webpack/hot/dev-server',
    'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=2000',
    resolve(sourceFolder, 'index')
  ],

  output: {
    hotUpdateChunkFilename: 'hot/hot-update.js',
    hotUpdateMainFilename: 'hot/hot-update.json'
  }
}

const prodConfig = {
  mode: 'production',

  entry: [
    '@babel/polyfill',
    resolve(sourceFolder, 'index')
  ],

  output: {
    path: buildFolder,
    filename: 'js/[name].js',
    publicPath: '/',
  },

  optimization: {
    minimize: true,
    nodeEnv: 'production',
  },

  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: 'css/[name].css'
    }),

    new OptimizeCssAssetsWebpackPlugin(),

    new HtmlWebpackPlugin({
      template: htmlTemplateFile,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true
      },
      inject: true
    }),
    new HtmlWebpackInlineSourcePlugin(),
    new CompressionPlugin({
      filename: '[path].br[query]',
      algorithm: 'brotliCompress',
      test: /\.(js|css|html|svg|.png|.json)$/,
      compressionOptions: { level: 11 },
      threshold: 10240,
      minRatio: 0.8,
      deleteOriginalAssets: false,
    })
  ],

  performance: {
    maxAssetSize: 1000 * 500, // 500KB
    // we only care about the size of compressed files
    assetFilter: (filename) => filename.endsWith('.br')
  }
}

const finalConfig = () => {
  if (process.env.NODE_ENV === 'production') {
    console.log('Running production config')
    return webpackMerge(baseConfig, prodConfig)
  } else {
    console.log('Running development config')
    return webpackMerge(baseConfig, devConfig)
  }
}

module.exports = finalConfig()
