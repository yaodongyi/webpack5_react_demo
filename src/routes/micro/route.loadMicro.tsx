/*
 * @Date: 2021-10-08 15:32:52
 * @LastEditTime: 2021-10-09 11:29:53
 */
import React, { Suspense } from 'react';
import { loadImport, syncLoadImport } from '@/utils';

// loader
const Micro = {
  FooterCmp: syncLoadImport({
    loader: import('teamB/FooterCmp'),
    title: 'loadImport - teamB/FooterCmp',
  }),
};
export default Micro;
