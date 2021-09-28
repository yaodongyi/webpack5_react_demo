/*
 * @Date: 2021-09-27 21:33:39
 * @LastEditTime: 2021-09-27 23:17:15
 * @Description:
 */
const path = require('path');

const PROJECT_PATH = path.resolve(__dirname, '../'); // 项目根路径
const SERVER_HOST = '127.0.0.1';
const SERVER_PORT = 3000;

module.exports = {
  PROJECT_PATH,
  SERVER_HOST,
  SERVER_PORT,
};
