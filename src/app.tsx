/*
 * @Date: 2021-09-28 17:28:41
 * @LastEditTime: 2021-10-11 10:36:10
 */

import React, { useEffect, useState } from 'react';
import HeaderCmp from './components/Header/Header';
import { Micro } from './routes';

interface Istate {
  num: number;
}

console.log(process.env);
const App = () => {
  const [state, setstate] = useState<Istate>({ num: 123 });
  useEffect(() => {
    console.log(state);
  }, []);
  return (
    <div>
      App1
      <HeaderCmp />
      <React.Suspense fallback={<>加载中....</>}>
        <Micro.FooterCmp />
      </React.Suspense>
    </div>
  );
};
export default App;
