const isProduction = process.env.NODE_ENV === 'production'
const isAnalys = process.env.NODE_ENV === 'analys'

const path = require('path')

// webpack packages
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const WebpackNotifierPlugin = require('webpack-notifier')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')

module.exports = {
  entry: {
    bundle: './assets/app',
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'js/[name].js',
  },

  /**
   * Exclude dependencies from the output bundle
   *
   * @see {@link https://webpack.js.org/configuration/externals/ externals API}
   */
  externals: {
  },

  /**
   * Manual configuration and overwriting of the optimization process
   *
   * @see {@link https://webpack.js.org/configuration/optimization/ optimization API}
   */
  optimization: {
    minimizer: [
      // Extend existing minimizers (i.e. `terser-webpack-plugin`)
      '...',

      /**
       * Sptimizes and minimizes CSS assets
       *
       * @see {@link https://github.com/webpack-contrib/css-minimizer-webpack-plugin Git repository}
       */
      new CssMinimizerPlugin(),
    ],
  },

  /**
   * Controls how the source maps are generated
   *
   * @see {@link https://webpack.js.org/configuration/devtool/ devtool API}
   */
  devtool: isProduction ? false : 'source-map',

  /**
   * Options that describe how modules are resolved
   *
   * @see {@link https://webpack.js.org/configuration/resolve/ resolve API}
   */
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },

  /**
   * A config to watch mode
   *
   * @see {@link https://webpack.js.org/configuration/watch/#watchoptions watchOptons API}
   */
  watchOptions: {
    ignored: ['node_modules/**'],
  },
  module: {
    rules: [
      {
        test: /\.(woff|woff2|eot|ttf)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000,
              name: '[name].[ext]',
              outputPath: 'fonts/',
              publicPath: '../fonts',
            },
          },
        ],
      },
      {
        test: /\.js|.tsx?$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      {
        test: /\.(sa|sc|c)ss$/,
        exclude: ['/node_modules', '/dist'],
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'sass-loader'],
      },
    ],
  },
  plugins: [
    /**
     * Adds notifications to all (error, warning) webpack actions.
     *
     * @see {@link https://github.com/Turbo87/webpack-notifier Git repository}
     */
    new WebpackNotifierPlugin({
      alwaysNotify: true,
    }),

    /**
     * Extract CSS into separate files
     *
     * @see {@link https://github.com/webpack-contrib/mini-css-extract-plugin Git repository}
     */
    new MiniCssExtractPlugin({
      filename: 'css/[name].css',
      chunkFilename: 'css/[name].[id].css',
    }),

  ],
}

if (isProduction) {
  module.exports.plugins.push(
    /**
     * Removes build folder
     *
     * @see {@link https://github.com/johnagan/clean-webpack-plugin Git repository}
     */
    new CleanWebpackPlugin(),
  )
}

if (isAnalys) {
  module.exports.plugins.push(
    /**
     * Visualize size of webpack output files with an interactive zoomable treemap
     *
     * @see {@link https://github.com/webpack-contrib/webpack-bundle-analyzer Git repository}
     */
    new BundleAnalyzerPlugin({
      analyzerMode: 'server',
      analyzerPort: 4000,
    }),
  )
}
