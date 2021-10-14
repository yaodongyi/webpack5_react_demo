/*
 * @Date: 2021-10-05 19:31:41
 * @LastEditTime: 2021-10-05 19:36:55
 */
const path = require('path');
const fs = require('fs');
const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

module.exports = {
  dotenv: resolveApp('.env'),
  appPackageJson: resolveApp('package.json'),
};
