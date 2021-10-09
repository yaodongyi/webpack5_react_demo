/*
 * @Date: 2021-09-13 19:39:11
 * @LastEditTime: 2021-10-08 16:57:06
 * @Description:
 */

declare namespace Log {
  interface Isend {
    title: string;
    content: any[];
    time?: string | null;
    backgroundColor?: string;
    type?: 'info' | 'error';
  }
  interface Console {
    /**
     * @methds 自定义日志打印
     * @link `../utils/console.tsx`
     */
    print: (e: Isend) => void;
  }
}
