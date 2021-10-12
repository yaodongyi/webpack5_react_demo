/*
 * @Date: 2021-10-04 20:32:08
 * @LastEditTime: 2021-10-12 15:33:58
 */

// import React from 'react';
import React, { useEffect, useState } from 'react';
import HeaderCmp from '../header/header';

const Footer= (props: any) => {
  const [state, setstate] = useState();
  useEffect(() => {
    console.log(props.children);
  }, []);
  return (
    <div>
      FooterCmp1
      <div>{props.children}</div>
    </div>
  );
};
interface Iprops {}
interface Istate {}
export default class FooterCmp extends React.Component<Iprops, Istate> {
  render() {
    return (
      <div className="Cmp">
        Cmp
        {this.props.children}
        <HeaderCmp />
        <Footer/>
      </div>
    );
  }
}
