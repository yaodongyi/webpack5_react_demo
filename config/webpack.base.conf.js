/*
 * @Date: 2021-09-27 20:52:07
 * @LastEditTime: 2021-09-28 23:11:31
 * @Description: 抽离公共webpack。分别用于prod.conf/dev.conf
 */

const path = require('path');
const WebpackBar = require('webpackbar');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
let { CleanWebpackPlugin } = require('clean-webpack-plugin'); /* 删除dist */

const fs = require('fs');
const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);
const package = require(resolveApp('package.json'));

const isEnvDevelopment = process.env.NODE_ENV === 'development';
const isEnvProduction = process.env.NODE_ENV === 'production';

console.log(process.env.NODE_ENV);

// style files regexes
const cssRegex = /\.css$/;
const cssModuleRegex = /\.module\.css$/;
const lessRegex = /\.less$/;
const lessModuleRegex = /\.module\.less$/;
const sassRegex = /\.(scss|sass)$/;
const sassModuleRegex = /\.module\.(scss|sass)$/;

const getStyleLoaders = ({ hashName }) => {
  const cssLoaders = [
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

  return cssLoaders;
};

module.exports = {
  entry: {
    app: path.resolve(__dirname, '../src/index.tsx'),
  },
  resolve: {
    // 添加extensions，可以对扩展后缀进行省略。
    extensions: ['.tsx', '.ts', '.js', '.jsx', '.json'],
    alias: {
      '@': path.resolve(__dirname, '../src'),
    },
  },
  plugins: [
    new CleanWebpackPlugin(),
    // https://www.npmjs.com/package/html-webpack-plugin
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../public/index.html'),
    }),
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
    // https://webpack.docschina.org/plugins/split-chunks-plugin/
    // 分包
    splitChunks: {
      chunks: 'all',
      minSize: 30000,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      automaticNameDelimiter: '~',
      // 抽离固定模块
      // 注意：cacheGroups 执行方式为右到左，下到上(loader，presets都一样)，因此剥离剩余的node_modules放在最后打包。
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          chunks: 'all',
          filename: `vendor.${package.name}.v${package.version}.bundle.js`,
        },
        react: {
          test: /node_modules[\\/]react/,
          chunks: 'all',
          priority: 2,
          filename: `framework.${package.name}.v${package.version}.bundle.js`,
        },
      },
    },
    // https://webpack.docschina.org/configuration/optimization/#optimizationruntimechunk
    // 分离运行时文件
    runtimeChunk: {
      name: entrypoint => `runtime~${entrypoint.name}`,
    },
  },
};

// filenames: isEnvProduction ? 'static/js/[name].[contenthash:8].js' : isEnvDevelopment && 'static/js/bundle.js',
