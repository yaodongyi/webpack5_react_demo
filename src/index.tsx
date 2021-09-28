/*
 * @Date: 2021-09-27 20:46:18
 * @LastEditTime: 2021-09-28 17:42:00
 */
import ReactDOM from 'react-dom';
import App from './app';

// import './index.css';
// import './index2.less';
import '@/index3.scss';
import '@/index.module.scss'; // TODO: module 需处理，hash
console.warn('我是入口！我成功执行了！');

// const ele = document.querySelector('#app');
// ele && (ele.innerHTML = '测试1234');

ReactDOM.render(<App />, document.querySelector('#app'));

if (module && module.hot) {
  module.hot.accept();
}
