/*
 * @Date: 2021-10-01 19:42:56
 * @LastEditTime: 2021-10-01 21:19:04
 * @Description: 微应用模块导入,按功能模块分表
 */

// @ts-nocheck
import React from 'react';
export const importModules = () => {
  return {
    HeaderCmp: React.lazy(() => import('teamA/HeaderCmp')),
  };
};
