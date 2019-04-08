const webpack = require ('webpack');
const path = require ('path');
const fs = require ('fs');
const MiniCssExtractPlugin = require ('mini-css-extract-plugin');
const HtmlWebPackPlugin = require("html-webpack-plugin");
// const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

console.log ('process.env.NODE_ENV: ', process.env.NODE_ENV);

const pages = fs
  .readdirSync (path.join (__dirname, 'src/pages'))
  .filter (name => name !== '.DS_Store');

const entry = {};
pages.forEach (page => {
  entry[page] = `./src/pages/${page}/index.tsx`;
});

console.log(entry);

module.exports = {
  context: __dirname,
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  entry,
  output: {
    filename: '[name].js',
    path: path.join(__dirname, 'build')
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json'],
    alias: {
      components: path.join (__dirname, 'src/components'),
      pages: path.join (__dirname, 'src/pages'),
      common: path.join (__dirname, 'src/common'),
      stores: path.join(__dirname, 'src/stores')
    },
  },
  externals: {
    // react: 'React',
    // 'react-dom': 'ReactDOM',
    // 'react-router': 'ReactRouter',
    // lodash: '_',
    // jquery: 'jQuery',
    // d3: 'd3',
    // echarts: 'echarts',
    // moment: 'moment',
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /(node_modules|bower_components)/,
        use: [
          {
            loader: 'babel-loader',
          },
          // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
          {loader: 'awesome-typescript-loader'},
        ],

      },
      { test: /\.js$/, enforce: "pre", loader: "source-map-loader" },
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: 'css-loader',
            options: {minimize: true},
          },
        ],
      },
      {
        test: /\.less$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: 'css-loader',
            options: {minimize: true},
          },
          {
            loader: 'less-loader',
            options: {
              javascriptEnabled: true,
            },
          },
        ],
      },
      {
        test: /\.xml$/,
        use: [
          {
            loader: 'raw-loader',
          },
        ],
      },
    ],
  },

  // Enable sourcemaps for debugging webpack's output.
  devtool: 'source-map',

  plugins: [
    //   new webpack.ContextReplacementPlugin(/moment[\\\/]locale$/, /^\.\/(zh-cn|en-gb)$/),

    // // 合并规则：合并所有plugins，同名plugin只出现一次
    new MiniCssExtractPlugin ({
      filename: '[name].css',
    }),

    // 允许错误不打断程序
    new webpack.NoEmitOnErrorsPlugin (),

    // // 检测打包体积大小
    // new BundleAnalyzerPlugin(),

    // 进度插件
    new webpack.ProgressPlugin((percentage, msg) => {
      const stream = process.stderr;
      if (stream.isTTY && percentage < 0.71) {
        stream.cursorTo(0);
        stream.write(`📦 ${msg}: `);
        stream.clearLine(1);
      }
    }),

    new HtmlWebPackPlugin({
      template: "./src/index.html",
      filename: "index.html",
      chunks: ['index', 'vendor'],
      minify: true
    }),

    new HtmlWebPackPlugin({
      template: "./src/index.html",
      filename: "help/index.html",
      chunks: ['help', 'vendor'],
      minify: true
    }),
  ],

  optimization: {
    usedExports: true, // 标记去掉未使用方法
    splitChunks: {
      chunks: 'async',
      minSize: 30000,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      automaticNameDelimiter: '~',
      name: true,
      cacheGroups: {
        commons: {
          test: module =>
            /[\\/]node_modules[\\/]/.test (module.resource) &&
            module.constructor.name !== 'CssModule',
          name: 'vendor',
          chunks: 'all',
        },
      },
    },
  },

  devServer: {
    hot: true,
  },
};
