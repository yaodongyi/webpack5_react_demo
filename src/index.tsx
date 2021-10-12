/*
 * @Date: 2021-09-27 20:46:18
 * @LastEditTime: 2021-10-12 18:57:09
 */
// import ReactDOM from 'react-dom';
// import App from './app';

// import './index.css';
// import './index2.less';
import '@/index3.scss';
import '@/index.module.scss'; // TODO: module 需处理，hash

// const ele = document.querySelector('#app');
// ele && (ele.innerHTML = '测试1234');

// ReactDOM.render(<App />, document.querySelector('#app'));

if (module && module.hot) {
  module.hot.accept();
}
import('./bootstrap');
