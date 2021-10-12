/*
 * @Date: 2021-09-28 17:28:41
 * @LastEditTime: 2021-10-12 19:04:55
 */
import React, { useEffect, useState } from 'react';
import FooterCmp from './components/footer/footer';
import { importModules } from './tools/micro/importModule';
const { HeaderCmp } = importModules();

// import('****' as string); // 正常输出****模块

// const HeaderCmp = LoadCmp('antd');
// function LoadCmp(cmp) {
//   return  import(cmp); // 报错 Uncaught Error: Cannot find module '****'
// }

interface Istate {
  num: number;
}

const App = () => {
  const [state, setstate] = useState<Istate>({ num: 123 });
  useEffect(() => {}, []);
  return (
    <div>
      App11111
      <React.Suspense fallback="Loading System">
        <HeaderCmp />
      </React.Suspense>
      <FooterCmp />
    </div>
  );
};
export default App;
