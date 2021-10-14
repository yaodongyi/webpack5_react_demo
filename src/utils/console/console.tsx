/*
 * @Date: 2021-09-15 23:40:06
 * @LastEditTime: 2021-10-08 17:27:17
 * @Description:
 */
export const sendLog = () => {
  window.console.print = (e: Log.Isend) => {
    const t = e.time === null ? null : new Date().toTimeString(),
      r = e.title,
      n = e.backgroundColor ?? '#DC6738',
      a = t
        ? [
            `${e.type == 'info' ? '\n' : ''}%c `.concat(t, ' %c ').concat(r, ' '),
            'padding: 1px; border-radius: 3px 0 0 3px; color: #fff; background: '.concat('#606060', ';'),
            'padding: 1px; border-radius: 0 3px 3px 0; color: #fff; background: '.concat(n, ';'),
          ]
        : ['%c '.concat(r, ' '), 'padding: 1px; border-radius: 3px; color: #fff; background: '.concat(n, ';')];
    console[e.type ?? 'info'](...a, ...e.content, '\n\n');

    return [...a, ...e.content, '\n\n'];
  };
};
