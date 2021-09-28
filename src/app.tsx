/*
 * @Date: 2021-09-28 17:28:41
 * @LastEditTime: 2021-09-28 19:03:27
 */

import { useState } from 'react';

interface Istate {
  num: number;
}

const App = () => {
  const [state, setstate] = useState<Istate>({ num: 123 });
  return <div>App</div>;
};
export default App;
