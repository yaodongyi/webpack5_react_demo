/*
 * @Date: 2021-09-28 17:28:41
 * @LastEditTime: 2021-10-06 23:06:56
 */

import React, { useEffect, useState } from 'react';
import HeaderCmp from './components/Header/Header';
const FooterCmp = React.lazy(() => import('teamB/FooterCmp' as string));
// const HeaderCmp = React.lazy(() => import('teamB/HeaderCmp' as string));

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
      <React.Suspense fallback="loading">
        <FooterCmp />
      </React.Suspense>
    </div>
  );
};
export default App;
