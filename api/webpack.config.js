const path = require(`path`)
const slsw = require(`serverless-webpack`)
const nodeExternals = require(`webpack-node-externals`)
const MinifyPlugin = require(`babel-minify-webpack-plugin`)
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')

const ENV =
  (process.env.NODE_ENV && process.env.NODE_ENV.toLowerCase()) ||
  (process.env.NODE_ENV = `development`)
const envProd = ENV === `production`
const outDir = path.join(__dirname, `dist`)

const isLocal = slsw.lib.webpack.isLocal

module.exports = {
  entry: slsw.lib.entries,
  target: `node`,
  mode: isLocal ? 'development' : 'production',
  externals: [nodeExternals()],
  resolve: {
    extensions: ['.js', '.json', '.ts'],
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
        test: /\.(ts|js)$/,
        exclude: [
          [
            path.resolve(__dirname, 'node_modules'),
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
