/*
 * @Date: 2021-10-04 20:32:08
 * @LastEditTime: 2021-10-11 15:12:18
 */

import { useEffect } from 'react';

const HeaderCmp = (props: any) => {
  useEffect(() => {
    console.log('HeaderCmp:', props);
  }, []);
  return (
    <div>
      HeaderCmp1
      <div>{props.children}</div>
    </div>
  );
};

export default HeaderCmp;
