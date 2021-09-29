/*
 * @Date: 2021-09-27 20:52:18
 * @LastEditTime: 2021-09-29 02:41:07
 * @Description: 开发环境配置
 */
const path = require('path');
const { merge } = require('webpack-merge');

const WebpackBase = require('./webpack.base.conf');
const DevOption = require('../scripts/start');

module.exports = merge(WebpackBase, {
  mode: 'development',
  // https://webpack.docschina.org/configuration/devtool/#development
  // eval-source-map - 每个模块使用 eval() 执行。初始化 source map 时比较慢，但是会在重新构建时提供比较快的速度，并且生成实际的文件。它会生成用于开发环境的最佳品质的 source map。
  devtool: 'eval-source-map',
  output: {
    filename: 'static/js/[name].js',
    path: path.resolve(__dirname, '../build'),
  },
  // https://webpack.docschina.org/configuration/stats/
  stats: 'errors-only', // 精确地控制 bundle 信息该怎么显示
  // https://webpack.docschina.org/configuration/other-options/#infrastructurelogging
  // 用于基础设施水平的日志选项。
  infrastructureLogging: {
    level: 'warn', // string = 'info' : 'none' | 'error' | 'warn' | 'info' | 'log' | 'verbose'
  },
  devServer: {
    host: DevOption.host ?? '8080',
    port: DevOption.port ?? '127.0.0.1',
    client: {
      logging: 'none', // 'log' | 'info' | 'warn' | 'error' | 'none' | 'verbose'
      overlay: {
        errors: true,
        warnings: false,
      }, // 当出现编译错误或警告时，在浏览器中显示全屏覆盖。
      progress: true, // 构建进度
      webSocketTransport: 'ws', // 'ws' | 'sockjs'
    },
    // https://webpack.docschina.org/configuration/dev-server/#devserverwebsocketserver
    webSocketServer: 'ws', // 该配置项允许我们选择当前的 web-socket 服务器或者提供自定义的 web-socket 服务器实现。
    compress: true, // 启用 gzip compression
    // https://webpack.docschina.org/configuration/dev-server/#devserverproxy
    proxy: DevOption.proxy ?? {},
    open: false,
    hot: true,
  },
  plugins: [
    // new webpack.HotModuleReplacementPlugin()
  ],
});
