const path = require(`path`)
const slsw = require(`serverless-webpack`)
const nodeExternals = require(`webpack-node-externals`)
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')

const outDir = path.join(__dirname, `dist`)

const isLocal = slsw.lib.webpack.isLocal

module.exports = {
  entry: slsw.lib.entries,
  target: `node`,
  mode: isLocal ? 'development' : 'production',
  externals: [nodeExternals()],
  resolve: {
    extensions: ['.js', '.json', '.ts', '.tsx'],
    symlinks: false,
    cacheWithContext: false,
    plugins: [new TsconfigPathsPlugin()],
  },
  optimization: {
    minimize: false,
  },
  output: {
    libraryTarget: `commonjs`,
    path: outDir,
    filename: `[name].js`,
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx|js)$/,
        exclude: [
          [
            path.resolve('..', __dirname, 'node_modules'),
            path.resolve('..', __dirname, '.serverless'),
            path.resolve(__dirname, '.dist'),
          ],
        ],
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
            },
          },
        ],
      },
      {
        test: /\.svg$/,
        use: ['@svgr/webpack'],
      },
      {
        test: /\.css$/i,
        use: [
          {
            loader: 'css-loader',
            options: {
              // Run `postcss-loader` on each CSS `@import`, do not forget that `sass-loader` compile non CSS `@import`'s into a single file
              // If you need run `sass-loader` and `postcss-loader` on each CSS `@import` please set it to `2`
              importLoaders: 1,
              // Automatically enable css modules for files satisfying `/\.module\.\w+$/i` RegExp.
              modules: {auto: true},
            },
          },
          {
            loader: 'postcss-loader',
          },
        ],
      },
    ],
  },
  plugins: [
    new ForkTsCheckerWebpackPlugin({
      typescript: {
        diagnosticOptions: {
          semantic: true,
          syntactic: true,
        },
        mode: 'write-references',
      },
    }),
  ],
}
