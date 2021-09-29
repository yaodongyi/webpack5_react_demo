/*
 * @Date: 2021-09-27 21:33:43
 * @LastEditTime: 2021-09-29 02:38:59
 */
'use strict';

process.env.BABEL_ENV = 'production';
process.env.NODE_ENV = 'production';

process.on('unhandledRejection', err => {
  throw err;
});
