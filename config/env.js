/*
 * @Date: 2021-10-05 19:53:46
 * @LastEditTime: 2021-10-06 15:09:09
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

const YK_APP = /^yk_/i;

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

  return { raw, stringified };
}

module.exports = getClientEnvironment;
