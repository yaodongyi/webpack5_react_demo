# 从0~1搭建react开发脚手架（webpack5）
> 背景：由于目前react脚手架还未提供webpack5版本，为了使用webpack5属性以提高项目效率，因此搭建`webpack+react`框架，集成开发所需功能。

## 第一步：不用多说直接新建文件夹，开始初始化项目结构
```vim
mkdir demo 
cd demo

# 创建项目常规目录结构
mkdir public script src config typings

# 创建webpack默认指向文件
touch webpack.config.js

```
### 初始化package (-y 代表yes，使用默认配置)
```vim
npm init -y 
```
### 配置`npm`启动配置(`package.json`)
```json
  "scripts": {
    "build": "NODE_ENV=production webpack",
    "start": "NODE_ENV=development webpack serve",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
```
**设定环境变量`NODE_ENV`这里是mac配置，window应该一样，如果不行就加`cross-env`，或直接设置mode`webpack --mode=production`，直接指向启动文件到`dev/prod`也行** 

虽然设置完`scripts`，目前还不可以启动项目，因为`NODE_ENV=development webpack serve`还缺少webpack。下面进行webpack所需配置：

当前版本:
```json
    "html-webpack-plugin": "^5.3.2",
    "webpack": "^5.54.0",
    "webpack-cli": "^4.8.0",
    "webpack-dev-server": "^4.3.0",
```

```vim
npm i webpack webpack-cli webpack-dev-server html-webpack-plugin -D
```
`-D`代表`devDependencies`开发环境所需依赖

> `webpack`： 模块打包器\
> `webpack-cli`： 用于设置自定义webpack配置\
> `webpack-dev-server`： 这个不用说了，不懂自行百度\
> `html-webpack-plugin`： `html`转译`plugin`，打包`html`

接下来先新建项目启动的`html`入口文件(这又是一个默认指向)：
```vim
touch public/index.html
```
打开`index.html`先设置`html`文档
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    Hello World !!!
</body>
</html>
```

新建入口文件`src/index.js`，`webpack`默认指向
```vim
touch src/index.js
```
**这时候运行`npm run start`就可以启动项目了。当然这是基础版，刚刚完成第一步！！！**
<div style="display:flex;width:600px;height:300px">
    <img style="flex-shrink: 0;" src="https://staticqc-operating.lycheer.net/image/weike-fQMKMs-1249425007.png" />
    <img style="flex-shrink: 0;" src="https://staticqc-operating.lycheer.net/image/weike-EZkRcb-327954411.png" />
</div>



## 二：接下来我们继续完善项目
> 按照我们上面写的`scripts`，一般我们项目都会有生产环境开发环境测试环境，现在我们对开发和生产环境做一个区分。

先新建两个文件：
```vim
touch config/webpack.dev.conf.js config/webpack.prod.conf.js 
```
那么新建的文件如何使用呢，上面我们说了，根目录的`webpack.config.js`才是`webpack`默认指向的文件。🤔️～～

emmmm～～ 既然`webpack`指向`webpack.config.js`，那我们自然可以通过`webpack.config.js`配置对应的开发/生产文件。

编写`webpack.config.js`:
```javascript
// 刚刚scripts已经设置了环境变量NODE_ENV，这时候我们就可以拿来用于环境区分了
let env = process.env.NODE_ENV;
let finalModule = {};
switch (env) {
  case 'development':
    finalModule = require('./config/webpack.dev.conf');
    break;
  default:
    finalModule = require('./config/webpack.prod.conf');
    break;
}
module.exports = finalModule;
```

### 开发环境配置(`./config/webpack.dev.conf`)
对于初级版本`dev.conf`配置，只需要👇
```javascript
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development', 
  entry: {
    app: path.resolve(__dirname, '../src/index'), // 设置入口文件
  },
  output: {
    filename: 'static/js/[name].js',
    path: path.resolve(__dirname, '../build'),
  },
  devServer: {
    host: '127.0.0.1',
    port: '3003',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../public/index.html'), // 设置html文件指向
    }),
  ],
};
```
开头已经说了，我们的主题是搭建集成开发所需功能的项目，因此我们对配置进行**初步**优化升级：
```javascript
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  // 提供 mode 配置选项，告知 webpack 使用相应模式的内置优化。
  // https://webpack.docschina.org/configuration/mode/
  mode: 'development',
  // https://webpack.docschina.org/configuration/devtool/#development
  // eval-source-map - 每个模块使用 eval() 执行。初始化 source map 时比较慢，但是会在重新构建时提供比较快的速度，并且生成实际的文件。它会生成用于开发环境的最佳品质的 source map。
  devtool: 'eval-source-map', // 开心就好
  entry: {
    app: path.resolve(__dirname, '../src/index'),
  },
  output: {
    filename: 'static/js/[name].js',
    path: path.resolve(__dirname, '../build'),
  },
  // https://webpack.docschina.org/configuration/stats/
  stats: 'errors-only', // 精确地控制 bundle 信息该怎么显示
  // https://webpack.docschina.org/configuration/other-options/#infrastructurelogging
  // 用于基础设施水平的日志选项。
  infrastructureLogging: {
    // level: 'warn', // string = 'info' : 'none' | 'error' | 'warn' | 'info' | 'log' | 'verbose'
  },
  devServer: {
    host: '127.0.0.1',
    port: '3003',
    client: {
      logging: 'none', // 'log' | 'info' | 'warn' | 'error' | 'none' | 'verbose'
      overlay: {
        errors: true,
        warnings: false,
      }, // 当出现编译错误或警告时，在浏览器中显示全屏覆盖。
      progress: true, // 构建进度
      //
      // ws，sockjs区别：
      // sockjs：
      // SockJS 是一个 JavaScript 库（用于浏览器），它提供了一个类似 WebSocket 的对象。
      // SockJS 为您提供了一个连贯的、跨浏览器的 Javascript API，它在浏览器和 Web 服务器之间创建了一个低延迟、全双工、跨域的通信通道，无论是否使用 WebSockets。
      // 这需要使用服务器，这是 Node.js 的一个版本。
      // ws：
      // 就是封装了一个WebSocket，客户端与服务端通信。
      //
      // https://github.com/sockjs/sockjs-node
      // https://github.com/websockets/ws
      webSocketTransport: 'ws', // 'ws' | 'sockjs'
    },
    // https://webpack.docschina.org/configuration/dev-server/#devserverwebsocketserver
    webSocketServer: 'ws',
    compress: true, // 启用 gzip compression
    // https://webpack.docschina.org/configuration/dev-server/#devserverproxy
    proxy: {},
    open: false,
    hot: true,
  },
  plugins: [
    // new webpack.HotModuleReplacementPlugin() // 以往需要增加hotmodule，现在webpack5默认集成
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../public/index.html'),
    }),
  ],
};

```

**运行`npm run start`，查看我们配置的开发环境是否正确运行～。**<i>(展示以下效果为正常)</i>
<img src="https://staticqc-operating.lycheer.net/image/weike-hjYpai-831794531.png" />


### 生产环境配置(`./config/webpack.prod.conf`)
同样初级版本`prod.conf`配置，只需要👇
```javascript
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'production',
  devtool: false,
  entry: {
    app: path.resolve(__dirname, '../src/index'),
  },
  output: {
    filename: 'static/js/[name].[contenthash:8].js', // 生产环境多了hash值，contenthash：内容变化即生成新的hash值
    path: path.resolve(__dirname, '../build'),
    clean: true, // 以前使用clean-webpack-plugin，现在直接设置clean就可以了
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../public/index.html'),
    }),
  ],
};

```
**这时候我们可以运行`npm run build`查看webpack打包功能。** *(可以看到生成了build文件)*
<img src="https://staticqc-operating.lycheer.net/image/weike-mhRyyJ-171494643.png" />

以上我们完成了`dev/prod`的初步配置，但是有没有发现，`dev`和`prod`有很多相似的配置项？\
这时候就需要创建一个公共文件来处理相同的配置，避免内容重复配置。

### 创建webpack公共文件，用于管理公共配置(`./config/webpack.base.conf`)

```vim
touch config/webpack.base.conf.js
```
初步抽离 `entry`,`plugins`
```javascript
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const isEnvDevelopment = process.env.NODE_ENV === 'development';
const isEnvProduction = process.env.NODE_ENV === 'production';
// console.log(process.env);

module.exports = {
  entry: {
    app: path.resolve(__dirname, '../src/index'),
  },
  // https://webpack.docschina.org/configuration/output/
  // w5将这个output集成了很多神气的东西，了解之后会发现很多新大陆
  output: {
    // publicPath: 'auto',
  },
  experiments: {
    topLevelAwait: true, // 试验性质顶级作用域允许await, 目前这个版本好像无效
  },

  plugins: [
    // https://www.npmjs.com/package/html-webpack-plugin
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../public/index.html'),
    }),
  ],
};
```
安装`webpack-merge`用于合并webpack配置
```vim
npm i webpack-merge -D
```
开始进行`dev/prod`配置抽离


```javascript
// ./config/webpack.prod.conf
const path = require('path');
const { merge } = require('webpack-merge');

const WebpackBase = require('./webpack.base.conf');

module.exports = merge(WebpackBase, {
  mode: 'production',
  devtool: false,
  output: {
    filename: 'static/js/[name].[contenthash:8].js',
    path: path.resolve(__dirname, '../build'),
    clean: true, // 以前使用clean-webpack-plugin，现在直接设置clean就可以了
  },
  plugins: [],
  optimization: {},
});
```
```javascript
// ./config/webpack.dev.conf
const path = require('path');
const { merge } = require('webpack-merge');
const WebpackBase = require('./webpack.base.conf');

module.exports = merge(WebpackBase, {
  mode: 'development',
  devtool: 'eval-source-map',
  output: {
    filename: 'static/js/[name].js',
    path: path.resolve(__dirname, '../build'),
  },
    ...... 这个阶段只抽离entry&plugins，此处配置和上面相同就不多余写了
  devServer:...
  plugins: [],
});
```
这时候可以看到我们的文件变得清晰了，不会再有多余的配置～，至此完成环境配置初步优化\
**配置完成之后可以运行`npm run start/build`再次进行查看**

## 三：对于前端项目来说，最基础的无非就是css,js,兼容性～

### 既然是前端，当然是界面优先，我们先造作`style`
依然常规套路：npm install ~~~
```json
    "css-loader": "^6.3.0",
    "less": "^4.1.2",
    "less-loader": "^10.0.1",
    "mini-css-extract-plugin": "^2.4.1",
    "sass": "^1.42.1",
    "sass-loader": "^12.1.0",
    "style-loader": "^3.3.0"
```
```vim
# 注意：sass旧版本使用node-sass，新版本直接用sass就好，具体查看npm有相应说明。

npm i style-loader css-loader less less-loader sass sass-loader mini-css-extract-plugin -D
```
**单独说一下`mini-css-extract-plugin`：将 `CSS` 提取到单独的文件中“*基于 `webpack v5` 的新特性构建，并且需要 `webpack 5` 才能正常工作*”，其他的大家应该都知道。**

此时就开始体现`base.conf`的作用了，起飞：
```javascript
// ./config/webpack.base.conf
    ... 
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

// style files regexes
const cssRegex = /\.css$/;
const cssModuleRegex = /\.module\.css$/;
const lessRegex = /\.less$/;
const lessModuleRegex = /\.module\.less$/;
const sassRegex = /\.(scss|sass)$/;
const sassModuleRegex = /\.module\.(scss|sass)$/;

const getStyleLoaders = ({ hashName }) => {
  const loaders = [
    isEnvDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader,
    {
      loader: 'css-loader',
      options: {
        modules: {
          localIdentName: hashName ? '[name]--[local]--[hash:base64:5]' : '[name]',
        },
        sourceMap: isEnvDevelopment,
      },
    },
  ];
  return loaders;
};

module.exports = {
    ...
  module: {
    rules: [
      {
        test: cssRegex,
        exclude: cssModuleRegex,
        use: [...getStyleLoaders({ hashName: false })],
      },
      {
        test: lessRegex,
        exclude: lessModuleRegex,
        use: [
          ...getStyleLoaders({ hashName: false }),
          {
            loader: 'less-loader',
            options: { sourceMap: isEnvDevelopment },
          },
        ],
      },
      {
        test: lessModuleRegex,
        use: [
          ...getStyleLoaders({ hashName: true }),
          {
            loader: 'less-loader',
            options: { sourceMap: isEnvDevelopment },
          },
        ],
      },
      {
        test: sassRegex,
        exclude: sassModuleRegex,
        use: [
          ...getStyleLoaders({ hashName: false }),
          {
            loader: 'sass-loader',
            options: { sourceMap: isEnvDevelopment },
          },
        ],
      },
      {
        test: sassModuleRegex,
        use: [
          ...getStyleLoaders({ hashName: true }),
          {
            loader: 'sass-loader',
            options: { sourceMap: isEnvDevelopment },
          },
        ],
      },
    ],
  },    
};
```
上面针对生产环境设置了`MiniCssExtractPlugin.loader`，因此我们配置一下`prod.conf` *“`style-loader`和`MiniCssExtractPlugin`区别在于一个是注入html一个是独立文件”*
```javascript
// ./config/webpack.prod.conf
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
    ... 

module.exports = merge(WebpackBase, {
    ...
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'static/css/[name].[contenthash:8].css',
      chunkFilename: 'static/css/[name].[contenthash:8].chunk.css',
    }),
  ],
});
```

完成以上配置后，我们创建对应样式文件来验证结果：
```javascript
// index.js
import "./index.css"
import "./index_scss.scss"
import "./index_less.less"
// 对应样式自行创建
// 上面对 **.module.less/scss，配置一起设置了，后续生成react文件我们再进行验证。
```
<div style="display:flex;">
    <img style="height:200px;" src="https://staticqc-operating.lycheer.net/image/weike-HxjkFF-959330330.png" />
    <img style="height:200px;" src="https://staticqc-operating.lycheer.net/image/weike-xENcEX-915211495.png" />
</div>

### 接下来继续造作js～
为了有些同学可能不用`ts`，所以`js/ts`分成两个步骤配置。\
#### 配置js
依然万事第一步：
```json
    "@babel/core": "^7.15.5",
    "@babel/runtime-corejs3": "^7.15.4",
    "babel-loader": "^8.2.2"
```
```vim
npm i @babel/core @babel/runtime-corejs3 babel-loader -D
```
>@babel/core：Babel编译器核心功能\
>@babel/runtime-corejs3: Babel模块polyfill“兜底操作” \
>babel-loader：顾名思义，用于转译js

```javascript
// ./config/webpack.base.conf

module.exports = {
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: {
          cacheDirectory: true,
          // cacheCompression: false, // cacheCompression 是babel-loader 默认会以 gzip 去压缩，如果你的文件量非常大可以尝试设为 false。
          compact: isEnvProduction,
        },
      },
    ],
  },
};
```
#### 配置ts
```json
    "typescript": "^4.4.3"
```
```vim
npm i typescript -D
```
创建`tsconfig.json`文件
```
npx tsc --init
```
当然，如果仅仅只是ts，这两步基本完成，但是你运行`npm run start`会发现，哈嘿～报错了：`ERROR in app Module not found: Error: Can't resolve '/Users/...'`
<img src="https://staticqc-operating.lycheer.net/image/weike-JZkest-885575569.png" />

下面我们让项目可以通过ts运行起来：\
修改`entry`指向`ts`文件，修改`rules`增加`ts`配置，然后再运行，起飞～
```javascript
// ./config/webpack.base.conf
module.exports = {
  entry: {
    app: path.resolve(__dirname, '../src/index.ts'), 
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: {
          cacheDirectory: true,
          // cacheCompression: false, // cacheCompression 是babel-loader 默认会以 gzip 去压缩，如果你的文件量非常大可以尝试设为 false。
          compact: isEnvProduction,
        },
      },
    ],
  },
};
```
其实上面的错误，最主要的就是入口文件指向问题，`webpack`默认会指向`js`文件，这就导致如果不加后缀会出现找不到文件的问题。\
那么我们可以通过配置`extensions`来扩展后缀进行省略。顺带`alias`这个下面就不说了 带过带过...
```javascript
// ./config/webpack.base.conf
module.exports = {
  resolve: {
    // 添加extensions，可以对扩展后缀进行省略。
    extensions: ['.tsx', '.ts', '.js', '.jsx', '.json'],
    alias: { 
      '@': path.resolve(__dirname, '../src'),
    },
  },
};
```
配置完就可以将文件后缀`.ts`去掉了。

### 配置完css，js接下来当然是兼容性，以及优化啦
#### 依然按顺序来，css
*要造作也要有资本，安装包搞起：*

**样式添加前缀工具**
```json
    "postcss-loader": "^6.1.1",
    "postcss-preset-env": "^6.7.0",
```
```vim
npm i postcss-loader postcss-preset-env -D
```
[`postcss-preset-env`](https://www.npmjs.com/package/postcss-preset-env#browsers)与`babel-preset-env`: 都是`package` 通过 `browserslist` 来转译那些你浏览器中不支持的特性

配置`package.json`
```json
// package.json
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all",
      "ie > 9"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version",
      "ie > 9"
    ]
  }
```

更改一下getStyleLoaders，添加`postcss-loader`
```javascript
// ./config/webpack.base.conf
const getStyleLoaders = ({ hashName }) => {
  const loaders = [
    isEnvDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader,
    {
      loader: 'css-loader',
      options: {
        modules: {
          localIdentName: hashName ? '[name]--[local]--[hash:base64:5]' : '[name]',
        },
        sourceMap: isEnvDevelopment,
      },
    },
    {
      loader: 'postcss-loader',
      options: {
        postcssOptions: {
          plugins: [['postcss-preset-env']],
        },
      },
    },
  ];

  return loaders;
};
```
> 配置完css兼容以后，我们来谈谈，听到webpack会想到什么？ \
> A：这都要问，不外乎 **打包，压缩，混淆** 等等呗。

**那么接下来我们就进行css压缩配置：**
```
npm install css-minimizer-webpack-plugin --D
```
`CssMinimizerWebpackPlugin`这个插件使用 `cssnano` 优化和压缩 `CSS`。

我们为生产环境设置css压缩优化：
```javascript
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
...
// ./config/webpack.prod.conf
module.exports = merge(WebpackBase, {
    ...
  optimization: {
    // 这将只在生产模式下启用 CSS 压缩优化。如果你需要在开发模式下使用，请设置 optimization.minimize 选项为 true。
    // minimize: true,
    minimizer: [
      // https://webpack.docschina.org/plugins/mini-css-extract-plugin/#minimizing-for-production
      new CssMinimizerPlugin(),
    ],
  },
});
```
配置完成，同上运行`build`自行查看

#### 配置完css，接着就是js/ts
安装转译工具
```vim 
npm i @babel/preset-env @babel/plugin-transform-runtime -D

## ts的朋友安装
npm i @babel/preset-typescript -D
```
创建.babelrc，配置转译器转码规则和插件
``` json
{
    // presets 执行顺序（至下往上）
    "presets": [
        [
            "@babel/preset-env",
            {
                // 启用 ES 模块语法到另一种模块类型的转换
                // "amd" | "umd" | "systemjs" | "commonjs" | "cjs" | "auto" | false，默认为"auto"
                // "modules": false
                "modules": "umd"
            }
        ],
        "@babel/preset-typescript"
    ],
    "plugins": [
        [
            "@babel/plugin-transform-runtime",
            {
                "corejs": {
                    "version": 3,
                    "proposals": true
                }
            }
        ]
    ]
}
```
验证可通过`build`查看`js`文件～

## 四：现在就进入心心念念的react依赖配置了
其实很简单，依然：
```vim 
npm i react react-dom @babel/preset-react -D

# ts的盆友们
npm i @types/react @types/react-dom -D
```
依旧配置`.babelrc`：
```json
{
    // presets 执行顺序（至下往上）,顺序很重要，先转译ts,react,js
    "presets": [
        [
            "@babel/preset-env",
            ...
        ],
        [
            "@babel/preset-react",
            {
                // 当设置为 automatic 时，将自动导入（import）JSX 转换而来的函数。
                // 当设置为 classic 时，不会自动导入（import）任何东西。
                // 示例：import React from 'react'; 无需导入
                "runtime": "automatic"
            }
        ],
        "@babel/preset-typescript"
    ],
  ...
}
```
新建`app.tsx`
```vim
touch src/app.tsx
```
改写`index.ts`为`index.tsx`
```javascript
// index.tsx
import App from './app';
import React from 'react';
import ReactDOM from 'react-dom';

ReactDOM.render(<App />, document.getElementById('app'));
```
```javascript
// app.tsx
import React, { useEffect, useState } from 'react';
interface Istate {
  num: number;
}

const App = () => {
  const [state, setstate] = useState<Istate>({ num: 123 });
  useEffect(() => {}, []);
  return <div>App1</div>;
};
export default App;
```
运行`npm run start`毫无疑问，直接起飞🛫️～，但是运行`npm run build`虽然也可以运行，但是 *“`WARNING in asset size limit: The following asset(s) exceed the recommended size limit`”*  提示你的资源太大了。

那还能怎么办？优化优化～
> 请问同学们能想到什么方法呢？\
> A：那还不是`压缩`\
> 那用什么工具呢？`uglify`？\
> A：low B 众所周知`uglify`不支持`es6`，当然`terser`啦

好了，那么我们来使用神器[`TerserWebpackPlugin`](https://webpack.docschina.org/plugins/terser-webpack-plugin/#root)。
```vim
npm install terser-webpack-plugin -D
```
```javascript
// ./config/webpack.prod.conf
const TerserWebpackPlugin = require('terser-webpack-plugin');
...
module.exports = merge(WebpackBase, {
  optimization: {
      ...
    minimizer: [
      new TerserWebpackPlugin({
        // https://webpack.docschina.org/plugins/terser-webpack-plugin/#extractcomments
        extractComments: false, // 启用/禁用剥离注释功能。
        // https://webpack.docschina.org/plugins/terser-webpack-plugin/#terseroptions
        terserOptions: {
          // https://github.com/terser/terser#compress-options
          compress: {
            // 通过pure_funcs去除console.log, 保留 info error, 特殊打印可以通过info输出。
            pure_funcs: ['console.log'],
          },
          mangle: {
            safari10: true,
          },
          // 保留类名
          keep_classnames: true,
          // 保留函数名
          keep_fnames: true,
          format: {
            // 删除注释
            comments: false,
            // ascii_only: (default false) -- 转义字符串和正则表达式中的 Unicode 字符（影响非 ascii 字符无效的指令）
            ascii_only: true,
          },
        },
      }),
    ],
  },
});
```
我们在`build`一下试试。<sub>*果然，文件变小了，警告也不提示了！！！*</sub>

> 压缩完了看到打包的app.js还有174kb，开发环境的app.js差不多1m，呐尼～\
> A：傻不傻的啊，什么都往app.js塞，肯定大了啊，人吃多了肚子还大呢！\
> 那怎么办？\
> A：压缩不就是*取其精华去其糟粕*，将撑大肚子的肉，分到该大的地方去，不就合理了？\
> 🤔哦。。。\
> A：ooo 哦半天都想不出来，`chunk` `chunk` `splitChunks`

```javascript
// ./config/webpack.base.conf
module.exports = {
    ...
  optimization: {
    //
    // 后续可以考虑加入代码分析，对重复的代码进行抽离共享
    // https://webpack.docschina.org/guides/code-splitting/#bundle-analysis
    //
    // https://webpack.docschina.org/plugins/split-chunks-plugin/
    // 分包
    splitChunks: {
      minSize: 30000,
      minChunks: 1,
      chunks: 'async',
      minRemainingSize: 0,
      maxAsyncRequests: 30,
      maxInitialRequests: 30,
      enforceSizeThreshold: 50000,
      // 抽离固定模块
      // 注意：cacheGroups 执行方式为右到左，下到上(loader，presets都一样)，因此剥离剩余的node_modules放在最后打包。
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          chunks: 'async',
          name: `vendor.bundle.js`,
        },
        react: {
          test: /node_modules[\\/]react/,
          chunks: 'all',
          priority: 2,
          name: `framework.bundle.js`,
        },
      },
    },
  },
};
```
将`react`分离出来，如果引入了其他模块，也可以再精细化拆解！<sub>拆解后`build` `app.js`只有`49.4kb`了</sub>

到这里大家是不是觉得完事了？ 太天真了😄还差的远呢～～

## 五：配置代码检测工具,这个步骤如果不想对项目做eslint的可以过滤掉！
安装`eslint`插件，以下则是一连串超长的配置文件。。。
```json
    "@typescript-eslint/eslint-plugin": "^4.31.2",
    "@typescript-eslint/parser": "^4.31.2",
    "eslint": "^7.32.0",
    "eslint-plugin-import": "^2.24.2",
    "eslint-plugin-react": "^7.26.0", 
    "eslint-plugin-react-hooks": "^4.2.0",
```
```vim
npm i @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint eslint-plugin-import eslint-plugin-react eslint-plugin-react-hooks -D
```
安装校验工具\
在单独的进程上运行 `TypeScript` 类型检查器的 `Webpack` 插件。
```
npm i fork-ts-checker-webpack-plugin -D
```

```javascript
// ./config/webpack.base.conf
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
...
module.exports = {
    ...
  plugins: [
    // https://github.com/TypeStrong/fork-ts-checker-webpack-plugin
    // 运行 TypeScript 类型检查器
    new ForkTsCheckerWebpackPlugin({
      // 添加支持eslint检测，控制台错误告警
      eslint: {
        // required - same as command `eslint ./src/**/*.{ts,tsx,js,jsx} --ext .ts,.tsx,.js,.jsx`
        files: './src/**.{ts,tsx,js,jsx}',
      },
      typescript: {
        // 指定文件
        configFile: path.resolve(__dirname, '../tsconfig.json'),
      },
    }),
  ]
};
```
创建`.eslintrc.js`文件
```vim
touch .eslintrc.js .eslintignore
```
```js
// .eslintrc.js 
module.exports = {
  root: true,
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    node: true,
    worker: true,
    jquery: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    // project: './tsconfig.json',
    parser: '@typescript-eslint/parser',
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
      },
    },
  },
  // ---------
  plugins: ['react', '@typescript-eslint', 'react-hooks'],
  extends: ['plugin:import/react', 'plugin:react-hooks/recommended'],
  rules: {
    // eslint文档 https://eslint.bootcss.com/docs/rules/
    // 关闭console告警
    'no-console': 'off',
    // (x) => {} 箭头函数参数只有一个时是否要有小括号。
    'arrow-parens': 'off',
    // for in 中必须有if判断 比如判断hasOwnProperty
    'guard-for-in': ['error'],
    // error; 结尾必须有分号
    semi: [2, 'always'],
    // 禁止在函数的 ( 前面有空格。存在async () => 这种问题，所以干掉这个
    'space-before-function-paren': 'off',
    // 当最后一个元素或属性与闭括号 ] 或 } 在 不同的行时，允许（但不要求）使用拖尾逗号；当在 同一行时，禁止使用拖尾逗号。
    'comma-dangle': ['error', 'only-multiline'],
    // 规定逗号后面必须添加空格
    'comma-spacing': ['error', { before: false, after: true }],
    // 缩进字节数
    // indent: [
    //   'error',
    //   2,
    //   {
    //     SwitchCase: 1, // case 子句将相对于 switch 语句缩进 2 个空格。
    //   },
    // ],
    // 字符串最大长度
    'max-len': 'off',
    // 字面量属性不严格使用""号
    'quote-props': ['error', 'as-needed'],
    // 允许在空行使用空白符\允许在注释块中使用空白符
    'no-trailing-spaces': ['error', { skipBlankLines: true, ignoreComments: true }],
    // 允许使用常量表达式 if(true)
    'no-constant-condition': 'off',
    // 使用单引号代替双引号 | 允许字符串使用``
    quotes: ['error', 'single', { allowTemplateLiterals: true }],
    'no-unused-expressions': 'off',
    // 允许单行中不使用大括号 if(true) xxx
    curly: ['error', 'multi-line'],
    // 这禁止掉 空格报错检查
    'no-irregular-whitespace': 'off',
    // 使用驼峰命名
    camelcase: 'off',
    //es6 模块 -------------------
    // error; 箭头函数的箭头前后必须有空格
    'arrow-spacing': [2, { before: true, after: true }],
    // error; 禁止import重复模块
    'no-duplicate-imports': 2,
    // error; 要求使用 let 或 const 而不是 var
    'no-var': 'error',
    // 非空文件末尾至少存在一行空行（或缺少换行）off 不用
    'eol-last': ['off'],
    // 关于引入的顺序，这玩意有点智障，关了
    'import/order': ['off'],
    // 允许使用obj["a"]和obj.a的模式
    'dot-notation': ['off'],
    // ts 模块 --------------------- https://github.com/typescript-eslint/typescript-eslint/tree/v2.34.0/packages/eslint-plugin/docs/rules
    // 未使用的参数
    '@typescript-eslint/no-unused-vars': ['off'],
    // 返回值没必要，比如生命周期就没必要加void
    '@typescript-eslint/explicit-function-return-type': ['off'],
    '@typescript-eslint/camelcase': ['off'],
    // react ---------
    'react-hooks/rules-of-hooks': 'error', // 检查 Hook 的规则
    'no-extra-boolean-cast': 'off',
    'react-hooks/exhaustive-deps': 'off', // 检查 hook 的依赖
  },
};
```
```shell
# .eslintignore
# 忽略目录
build/
tests/
demo/

# node 覆盖率文件
coverage/

# 忽略文件
**/*-min.js
**/*.min.js
```
配置`tsconfig.json`
```json
// tsconfig.json
{
  "compileOnSave": false,
  "buildOnSave": false,
  "compilerOptions": {
    // 实验性选项
    "experimentalDecorators": true, // 启用实验性的ES装饰器
    "emitDecoratorMetadata": true, // 给源码里的装饰器声明加上设计类型元数据
    "baseUrl": ".",
    "outDir": "build",
    "module": "ESNext",
    "target": "ESNext",
    "jsx": "react-jsx",
    "moduleResolution": "node",
    "allowSyntheticDefaultImports": true,
    "lib": [
      "es6",
      "dom"
    ],
    "sourceMap": true,
    "allowJs": true,
    "rootDir": "./",
    "forceConsistentCasingInFileNames": true,
    "noImplicitReturns": true,
    "noImplicitThis": true,
    "noImplicitAny": false,
    "importHelpers": true,
    "strictNullChecks": true,
    "suppressImplicitAnyIndexErrors": true,
    "noUnusedLocals": false,
    "skipLibCheck": true,
    "types": [
      "node",
    ],
    "paths": {
      "@/*": [
        "./src/*"
      ],
    }
  },
  "include": [
    "src",
    "typings/*",
  ],
  "exclude": [
    "node_modules",
    "build",
    "public"
  ]
}
```
以上为常规配置，如需自定义自行操作～～～\
<sub>校验配置暂告一段落...</sub>

## 六：完善react配置
### 配置react的***.module.less/scss样式
使用`import style from './index_scss.module.scss';`
```javascript
// app.tsx
import React, { useEffect, useState } from 'react';
import style from './index_scss.module.scss';
interface Istate {
  num: number;
}

const App = () => {
  const [state, setstate] = useState<Istate>({ num: 123 });
  useEffect(() => {
    console.log(state);
  }, []);
  return <div>App1</div>;
};
export default App;

```
运行～ 毫无疑问 肯定报错！

*`Cannot find module './index_scss.module.scss' or its corresponding type declarations.`*

这时候就要发挥d.ts的作用了
```vim
touch typings/typings.d.ts
```
配置typings.d.ts
```typescript
// typings.d.ts
declare namespace NodeJS {
  interface ProcessEnv {
    readonly NODE_ENV: 'development' | 'production' | 'test';
    readonly PUBLIC_URL: string;
  }
}

declare module '*.bmp' {
  const src: string;
  export default src;
}

declare module '*.gif' {
  const src: string;
  export default src;
}

declare module '*.jpg' {
  const src: string;
  export default src;
}

declare module '*.jpeg' {
  const src: string;
  export default src;
}

declare module '*.png' {
  const src: string;
  export default src;
}

declare module '*.webp' {
  const src: string;
  export default src;
}

declare module '*.svg' {
  import * as React from 'react';

  export const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement> & { title?: string }>;

  const src: string;
  export default src;
}

declare module '*.module.scss' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.module.less' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}
```

## 七：进一步优化webpack
### 对于`react-cli`搭建的项目大家都不默生，在`react-cli`项目中可以看到带着`style`,`manifest.json`,等等这些文件如何导入html呢？我们接下来看看：

利用`copy-webpack-plugin`插件

`npm i copy-webpack-plugin -D`

往`base.conf`文件添加`plugin`配置👇

```javascript
// ./config/webpack.base.conf

const CopyPlugin = require('copy-webpack-plugin');
 ... 

    // https://webpack.js.org/plugins/copy-webpack-plugin/
    // 将已存在的单个文件或整个目录复制到构建目录。
    new CopyPlugin({
      patterns: [
        {
          context: 'public',
          from: '**/*',
          to: path.resolve(__dirname, '../build'),
          globOptions: {
            dot: true,
            gitignore: true,
            // 忽略index.html避免覆盖（必填）
            ignore: ['**/index.html'],
          },
        },
      ],
    }),
```
**可自行新建文件试验！**

### 优化控制台打印
利用`webpackbar`工具，查看`start/build`相应的打包时长

```javascript
// ./config/webpack.base.conf

const WebpackBar = require('webpackbar');
    ...

    // https://www.npmjs.com/package/webpackbars
    // webpack进度条 + 编译回调
    new WebpackBar({
      name: 'youke_component_system\n',
      color: '#52c41a',
      start(context) {
        // Called when (re)compile is started
      },
      change(context) {
        // Called when a file changed on watch mode
      },
      update(context) {
        // Called after each progress update
      },
      done(context) {
        // Called when compile finished
      },
    }),
```
<img src="https://staticqc-operating.lycheer.net/image/weike-eAEDsA-9998325.png" />

对比`ice.js`\
其实也没多大差别，大家都是几秒难！

<img src="https://staticqc-operating.lycheer.net/image/weike-SCZGEb-1058766354.png" />


## 升级环境变量配置
尽请期待...

## postcss扩展配置，样式兼容
尽请期待...

## webpack5 ModuleFederationPlugin（模块联邦）
尽请期待...

## webpack5 cache
尽请期待...

## 终端输出优化
尽请期待...

## 项目结构化
尽请期待...

## more...