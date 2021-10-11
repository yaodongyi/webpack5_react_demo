/*
 * @Date: 2021-10-09 17:43:53
 * @LastEditTime: 2021-10-11 10:35:35
 * @Description: devServer 检查host/port，生成输出地址
 */
let os = require('os'); // 提供基本的系统操作函数
let portfinder = require('portfinder'); // 端口查询器

const getAddress = config => {
  return new Promise((resolve, reject) => {
    portfinder.basePort = process.env.PORT || config.devServer.port || 8080; // 从config 基础devServer里面拿端口号，或者进程里面拿。
    /**
     * 检查是否有host,没有的话取主机ip为host
     * @param {String} localIp 传入host
     */
    let getIPAdress = function (localIp) {
      if (localIp && localIp != '0.0.0.0') return localIp;
      let localIPAddress = '';
      let interfaces = os.networkInterfaces();
      for (let devName in interfaces) {
        if (Object.prototype.hasOwnProperty.call(interfaces, devName)) {
          let iface = interfaces[devName];
          for (let i = 0; i < iface.length; i++) {
            let alias = iface[i];
            if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
              localIPAddress = alias.address;
            }
          }
        }
      }
      return localIPAddress;
    };

    /**
     * 清除日志
     * @description 默认清空日志，如果需要保留，则采用
     * ```js
     * const readline = require('readline'); // 读取数据接口
     * readline.cursorTo(process.stdout, 0, 0);
     * readline.clearScreenDown(process.stdout);
     * ```
     */
    const clearConsole = () => {
      //   let lines = process.stdout.getWindowSize()[1];
      //   for (let i = 0; i < lines; i++) {
      //     console.log('\r');
      //   }
      //   process.stdout.write('\x1B[0f'); // window \033[0f
      process.stdout.write(process.platform === 'win32' ? '\x1B[2J\x1B[0f' : '\x1B[2J\x1B[3J\x1B[H');
    };

    /**
     * @param err 报错信息
     * @param port 端口号
     * @desc 生成终端打印提示信息，查询端口占用，如果占用则生成新端口+1。
     */
    portfinder.getPort((err, port) => {
      if (err) {
        reject(err); // 提示报错
      } else {
        let getIp = getIPAdress(config.devServer.host);
        process.env.PORT = port; // 设置进程端口号
        config.devServer.port = port; // 设置devServer端口号
        config.devServer.host = config.devServer.host === '0.0.0.0' ? '0.0.0.0' : getIp; // 获取host

        // 设置提示配置
        let Network = `${config.devServer.https ? 'https' : 'http'}://${
          (config.devServer.host === '0.0.0.0' && getIp) || getIp
        }:${port}`;
        let Local = `${config.devServer.https ? 'https' : 'http'}://${
          config.devServer.host === 'localhost' ? '127.0.0.1' : 'localhost'
        }:${port}`;

        clearConsole();

        let first = true;
        process.stdin.on('done', function () {
          // 首次构建完毕输出
          if (first) {
            first = false;
            console.log(
              `App running at: \n    - Local:  ${'\033[94m'}${Local}${'\033[39m'}\n    - Network ${'\033[94m'}${Network}${'\033[39m'}`,
            );
            console.log(`To create a production build, run ${'\033[93m'}${'npm run build'}${'\033[39m'}.\n`);
          }
        });

        resolve(config);
      }
    });
  });
};

module.exports = getAddress;
