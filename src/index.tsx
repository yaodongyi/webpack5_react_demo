/*
 * @Date: 2021-09-27 20:46:18
 * @LastEditTime: 2021-10-08 16:49:39
 */
import { initMethods } from './utils/inject';
import '@/index3.scss';
import '@/index.module.scss'; // TODO: module 需处理，hash

initMethods();

console.warn('我是入口！我成功执行了！11');

if (module && module.hot) {
  module.hot.accept();
}

import('./bootstrap');
