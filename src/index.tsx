/*
 * @Date: 2021-09-27 20:46:18
 * @LastEditTime: 2021-10-11 10:46:18
 */
import { initMethods } from './utils/inject';
import '@/index3.scss';
import '@/index.module.scss'; // TODO: module 需处理，hash

initMethods();

if (module && module.hot) {
  module.hot.accept();
}

import('./bootstrap');
