/*
 * @Date: 2021-10-05 19:53:46
 * @LastEditTime: 2021-10-09 17:17:23
 * @Description: 环境变量
 */

const fs = require('fs');
const paths = require('./paths');

const NODE_ENV = process.env.NODE_ENV;
const yk_env = process.env.yk_env;

const dotenvFiles = [
  yk_env && `${paths.dotenv}.${NODE_ENV}.${yk_env}`,
  `${paths.dotenv}.${NODE_ENV}.local`,
  `${paths.dotenv}.${NODE_ENV}`,
  NODE_ENV !== 'test' && `${paths.dotenv}.local`,
  paths.dotenv,
].filter(Boolean);

dotenvFiles.forEach(dotenvFile => {
  if (fs.existsSync(dotenvFile)) {
    require('dotenv-expand')(
      require('dotenv').config({
        path: dotenvFile,
      }),
    );
  }
});

const YK_APP = /^(yk|ykr)_/i;
const PROXY_REG = /^(yk|ykr)_[\S*]+._proxy$/i;

function getClientEnvironment() {
  const raw = Object.keys(process.env)
    .filter(key => YK_APP.test(key))
    .reduce(
      (env, key) => {
        env[key] = process.env[key];
        return env;
      },
      {
        NODE_ENV: process.env.NODE_ENV || 'development',
        yk_env: process.env.yk_env || 'm',
        PUBLIC_URL: process.env.PUBLIC_URL || process.env.yk_base_url || '/',
      },
    );

  // Stringify all values so we can feed into webpack DefinePlugin
  const stringified = {
    'process.env': Object.keys(raw).reduce((env, key) => {
      env[key] = JSON.stringify(raw[key]);
      return env;
    }, {}),
  };

  // 代理列表
  const proxyList = Object.keys(process.env)
    .filter(x => PROXY_REG.test(x))
    .map(key => {
      if (!process.env[process.env[key]]) {
        const str = `error: 环境变量输出错误 \n process.env.${key} 所对应的环境变量 "process.env.${process.env[key]}" 未定义`;
        throw console.log(
          '[proxyList ~ env.js]',
          '\033[91m',
          '\n-------------------------------------------------------------------------------\n\n',
          str.replace(/(.{68})/g, '$1 \n '),
          /(.{67})/g.test(str) ? '\n' : '',
          '\n-------------------------------------------------------------------------------',
          '\033[39m',
        );
      }
      return {
        [`/${process.env[key]}`]: {
          target: process.env[process.env[key]], // 目标接口域名
          changOrigin: true, // 将主机标头的原点更改为目标URL,解决跨域
          ws: true, // proxy websockets
          secure: false, // 设置支持https协议的代理,不检查安全问题
          pathRewrite: {
            [`^/${process.env[key]}`]: '/', // 重写
          },
        },
      };
    });

  console.log(proxyList);

  return { raw, stringified, proxyList };
}

module.exports = getClientEnvironment();
