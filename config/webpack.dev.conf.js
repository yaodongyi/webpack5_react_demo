/*
 * @Date: 2021-09-27 20:52:18
 * @LastEditTime: 2021-10-06 16:39:54
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
    host: DevOption.host ?? '127.0.0.1',
    port: DevOption.port ?? '8080',
    client: {
      logging: 'none', // 'log' | 'info' | 'warn' | 'error' | 'none' | 'verbose'
      overlay: {
        errors: true,
        warnings: false,
      }, // 当出现编译错误或警告时，在浏览器中显示全屏覆盖。
      progress: true, // 构建进度
      //
      // ws，sockjs区别：
      // sockjs：
      // SockJS 是一个 JavaScript 库（用于浏览器），它提供了一个类似 WebSocket 的对象。
      // SockJS 为您提供了一个连贯的、跨浏览器的 Javascript API，它在浏览器和 Web 服务器之间创建了一个低延迟、全双工、跨域的通信通道，无论是否使用 WebSockets。
      // 这需要使用服务器，这是 Node.js 的一个版本。
      // ws：
      // 就是封装了一个WebSocket，客户端与服务端通信。
      //
      // https://github.com/sockjs/sockjs-node
      // https://github.com/websockets/ws
      webSocketTransport: 'ws', // 'ws' | 'sockjs'
    },
    // https://webpack.docschina.org/configuration/dev-server/#devserverwebsocketserver
    webSocketServer: 'ws',
    compress: true, // 启用 gzip compression
    // https://webpack.docschina.org/configuration/dev-server/#devserverproxy
    proxy: DevOption.proxy ?? {},
    open: false,
    // 热更bug webpack暂未解决，暂时使用liveReload
    liveReload: true,
    hot: false,
  },

  plugins: [
    // new webpack.HotModuleReplacementPlugin() // webpack5默认集成
  ],
});
