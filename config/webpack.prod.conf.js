/*
 * @Date: 2021-09-27 20:52:30
 * @LastEditTime: 2021-10-09 12:09:45
 * @Description: 生产环境配置
 */
const path = require('path');
const { merge } = require('webpack-merge');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

const WebpackBase = require('./webpack.base.conf');

module.exports = merge(WebpackBase, {
  mode: 'production',
  devtool: false,
  output: {
    filename: 'static/js/[name].[contenthash:8].js',
    path: path.resolve(__dirname, '../build'),
    clean: true, // 以前使用clean-webpack-plugin，现在直接设置clean就可以了
    // 告诉 webpack 启用 cross-origin 属性 加载 chunk。
    // 仅在 target 设置为 'web' 时生效，通过使用 JSONP 来添加脚本标签，实现按需加载模块。
    crossOriginLoading: 'anonymous',
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'static/css/[name].[contenthash:8].css',
      chunkFilename: 'static/css/[name].[contenthash:8].chunk.css',
    }),
  ],
  optimization: {
    // 这将只在生产模式下启用 CSS 压缩优化。如果你需要在开发模式下使用，请设置 optimization.minimize 选项为 true。
    minimize: true,
    minimizer: [
      // https://webpack.docschina.org/plugins/mini-css-extract-plugin/#minimizing-for-production
      new CssMinimizerPlugin(),
      // https://webpack.docschina.org/plugins/terser-webpack-plugin/#root
      new TerserWebpackPlugin({
        // https://webpack.docschina.org/plugins/terser-webpack-plugin/#extractcomments
        extractComments: false, // 启用/禁用剥离注释功能。
        // https://webpack.docschina.org/plugins/terser-webpack-plugin/#terseroptions
        terserOptions: {
          // https://github.com/terser/terser#compress-options
          compress: {
            // 通过pure_funcs去除console.log, 保留 info error, 特殊打印可以通过info输出。
            pure_funcs: ['console.log'],
          },
          mangle: {
            safari10: true,
          },
          // 保留类名
          keep_classnames: true,
          // 保留函数名
          keep_fnames: true,
          format: {
            // 删除注释
            comments: false,
            // ascii_only: (default false) -- 转义字符串和正则表达式中的 Unicode 字符（影响非 ascii 字符无效的指令）
            ascii_only: true,
          },
        },
      }),
    ],
  },
});
