const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackNotifierPlugin = require('webpack-notifier');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require("copy-webpack-plugin");
const webpackConfig = require('./webpack.config');

module.exports = (env, argv) => {
   const watchMode = argv.liveReload || false
   const modeEnv = argv.mode || 'development'
   const isProd = modeEnv === 'production'
   const config = webpackConfig(modeEnv)

   const optimization = {
      splitChunks: {
         cacheGroups: {
            vendors: {
               name: 'vendors',
               test: /node_modules/,
               chunks: 'all',
               enforce: true,
            },
         },
      },
      minimizer: [],
   }

   if (isProd) {
      optimization.minimizer.push(new UglifyJsPlugin())
   }

   return {
      context: path.resolve(__dirname, '../'),
      devtool: !isProd && 'source-map',
      entry: {
         main: './src/index.tsx',
      },
      output: {
         path: path.resolve(__dirname, '../dist'),
         filename: watchMode ? 'assets/[name].[hash].js' : 'assets/[name].[chunkhash].js',
         publicPath: '/',
      },
      module: {
         rules: [
            config.modules.ts,
            config.modules.js,
            config.modules.css,
         ],
      },
      plugins: [
         new CleanWebpackPlugin(),
         new HtmlWebpackPlugin({
            template: './public/index.html',
         }),
         new WebpackNotifierPlugin({ alwaysNotify: false }),
         new CopyWebpackPlugin({
            patterns: [
               {
                  from: './public/meta',
                  to: './meta'
               },
            ],
         }),
      ],
      resolve: config.resolve,
      optimization,
      performance: {
         hints: false,
      },
      devServer: {
         compress: true,
         port: 3000,
         hot: true,
         open: true,
         historyApiFallback: true,
      },
   }
}