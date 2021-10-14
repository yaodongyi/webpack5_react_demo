/*
 * @Date: 2021-10-08 15:11:48
 * @LastEditTime: 2021-10-09 11:28:18
 * @Description: 自定义加载工具
 */

import lazyLoad from '@/routes/core/lazy-load';
import { lazy } from 'react';

interface IloadImoprt {
  /** 远程模块 */
  loader: Promise<any>;
  /** 默认保底模块 */
  default?: any;
  /** 模块title，（非必传）用于检错提示 */
  title?: string;
}

/** 同步加载远程模块
 *
 * 远程模块使用示例：直接引用 `<Micro.FooterCmp />` 即可
 */
export const syncLoadImport = (_e: IloadImoprt): any => {
  return lazyLoad(() => _e.loader);
};

/** 异步加载远程模块
 *
 * 远程模块使用示例：
 * ```tsx
 * // @param {string/JSX.Element} fallback 异步加载 loading时显示的内容，可做骨架屏。
 * <React.Suspense fallback={<>加载中...</>}>
 *    <Micro.FooterCmp />
 * </React.Suspense>
 * ```
 */
export const loadImport = (_e: IloadImoprt): React.LazyExoticComponent<React.ComponentType<any>> => {
  return lazy(() => {
    return new Promise((r): any => {
      _e.loader.then(r).catch(err => {
        _e?.title ? console.print({ title: _e.title, content: ['\n\n', err], type: 'error' }) : console.error(err);
        _e?.default && r(_e.default);
      });
    });
  });
};
