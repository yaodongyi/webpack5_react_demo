/*
 * @Date: 2021-09-27 20:52:07
 * @LastEditTime: 2021-10-09 19:05:18
 * @Description: 抽离公共webpack。分别用于prod.conf/dev.conf
 */

const path = require('path');
const paths = require('./paths');
const webpack = require('webpack');
const WebpackBar = require('webpackbar');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const { ModuleFederationPlugin } = require('webpack').container;

const package = require(paths.appPackageJson);

const isEnvDevelopment = process.env.NODE_ENV === 'development';
const isEnvProduction = process.env.NODE_ENV === 'production';

const env = require('./env');

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

// console.log(process.env);

module.exports = {
  entry: {
    app: path.resolve(__dirname, '../src/index'),
  },
  // https://webpack.docschina.org/configuration/output/
  // w5将这个output集成了很多神气的东西，了解之后会发现很多新大陆
  output: {
    // publicPath: '/',
    // publicPath: 'auto',
  },
  experiments: {
    topLevelAwait: true, // 试验性质顶级作用域允许await, 目前这个版本好像无效
  },
  resolve: {
    // 添加extensions，可以对扩展后缀进行省略。
    extensions: ['.tsx', '.ts', '.js', '.jsx', '.json'],
    alias: {
      '@': path.resolve(__dirname, '../src'),
    },
  },
  plugins: [
    // https://www.npmjs.com/package/html-webpack-plugin
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../public/index.html'),
      chunks: ['app'],
    }),
    new webpack.DefinePlugin(env.stringified),
    // https://www.npmjs.com/package/webpackbar
    // webpack进度条 + 编译回调
    new WebpackBar({
      name: 'youke_component_system\n',
      color: '#52c41a',
      reporter: {
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
          process.stdin.emit('done');
        },
      },
    }),
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
    // 模块联邦
    // TODO: 热更bug webpack暂未解决 --> https://github.com/module-federation/module-federation-examples/issues/358
    // working on it, its extremely complex. We will eventually roll support for it into webpack 5 but its a monster to achieve
    new ModuleFederationPlugin({
      name: 'teamA',
      filename: 'teamA.js',
      exposes: {
        './HeaderCmp': path.resolve(__dirname, '../src/components/Header/Header'), // 这个键名是拿到teamA.js后用o函数取的位置，因为远程调用是import(teamA/XXX)，切了路径所以是个路径
      },
      remotes: {
        teamB: `teamB@${isEnvDevelopment ? process.env.ykr_coupon_proxy : process.env.ykr_coupon}/teamB.js`,
      },
    }),
  ],
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
      {
        test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
        type: 'asset',
        generator: {
          filename: 'static/images/[name]__[hash][ext][query]',
        },
        // parser: { dataUrlCondition: { maxSize: 4 * 1024 /* 4kb，默认8kb */ } },
      },
    ],
  },
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
          name: `vendor.${package.name}.v${package.version}.bundle.js`,
        },
        react: {
          test: /node_modules[\\/]react/,
          chunks: 'all',
          priority: 2,
          name: `framework.${package.name}.v${package.version}.bundle.js`,
        },
      },
    },
  },
};

// filenames: isEnvProduction ? 'static/js/[name].[contenthash:8].js' : isEnvDevelopment && 'static/js/bundle.js',
