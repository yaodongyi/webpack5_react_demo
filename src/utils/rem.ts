/*
 * @Author: yaodongyi
 * @Description:
 * @Date: 2019-05-05 23:13:37
 */

/**
 * @desc 设置根据界面宽度375比16px进行响应式适配。postcss-pxtorem 设置"selectorBlackList":[".ignore",".hairlines","van"],忽略框架代码
 */
const baseSize = 16; // 设计图等比字体大小
const ui_width = 375; // 设计图宽度
const max_width = 480; // 屏幕最大宽度，大于此宽度则不再放大
const min_width = 320; // 屏幕最小宽度，小于此宽度则不再缩放
// 设置 rem 函数
function setRem() {
  const scale = document.documentElement.clientWidth < max_width ? (document.documentElement.clientWidth > min_width ? document.documentElement.clientWidth / ui_width : min_width / ui_width) : max_width / ui_width;
  // 设置页面根节点字体大小
  document.documentElement.style.fontSize = baseSize * Math.min(scale, 2) + 'px';
  // 根据postcss所设置的根rem比例 1rem = 16px
}
// 初始化
setRem();
// 改变窗口大小时重新设置 rem
window.onresize = function () {
  setRem();
};

/** width change rem */
export function styleChangeRem(val: number): string {
  return (val / 16).toFixed(2) + 'rem';
}
/** height change rem */
export function HtmlFsToRem(val: number): string {
  const html: any = document.getElementsByTagName('html')[0];
  return (val / html.style.fontSize.split('px')[0]).toFixed(2) + 'rem';
}

export const WtoRem = styleChangeRem;
export const HtoRem = HtmlFsToRem;
