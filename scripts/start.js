/*
 * @Date: 2021-09-27 21:33:39
 * @LastEditTime: 2021-10-02 14:13:27
 * @Description:
 */
process.env.BABEL_ENV = 'development';
process.env.NODE_ENV = 'development';

process.on('unhandledRejection', err => {
  throw err;
});

module.exports = {
  host: '127.0.0.1',
  port: '3001',
  proxy: {
    '/micro_3000': {
      target: 'http://localhost:3000', // 后台接口域名
      changOrigin: true, // 将主机标头的原点更改为目标URL,解决跨域
      ws: true, // proxy websockets
      secure: false, // 设置支持https协议的代理,不检查安全问题
      pathRewrite: {
        '^/micro_3000': '/', // 重写
      },
    },
  },
};
