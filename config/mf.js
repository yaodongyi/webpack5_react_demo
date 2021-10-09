/*
 * @Date: 2021-10-09 19:46:28
 * @LastEditTime: 2021-10-09 19:52:08
 * @Description: 注入ModuleFederationPlugin
 */
const path = require('path');

const isEnvDevelopment = process.env.NODE_ENV === 'development';

const mf = {
  name: 'teamA',
  filename: 'teamA.js',
  exposes: {
    './HeaderCmp': path.resolve(__dirname, '../src/components/Header/Header'), // 这个键名是拿到teamA.js后用o函数取的位置，因为远程调用是import(teamA/XXX)，切了路径所以是个路径
  },
  remotes: {
    teamB: `teamB@${isEnvDevelopment ? process.env.ykr_coupon_proxy : process.env.ykr_coupon}/teamB.js`,
  },
};

module.exports = mf;
