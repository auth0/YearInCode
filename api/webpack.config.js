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
  devtool: slsw.lib.webpack.isLocal
    ? 'eval-cheap-module-source-map'
    : 'source-map',
  resolve: {
    extensions: ['.js', '.json', '.ts'],
    symlinks: false,
    cacheWithContext: false,
    plugins: [new TsconfigPathsPlugin()],
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
    new MinifyPlugin({
      keepFnName: true,
      keepClassName: true,
      booleans: envProd,
      deadcode: true,
      evaluate: envProd,
      flipComparisons: envProd,
      mangle: false, // some of our debugging functions require variable names to remain intact
      memberExpressions: envProd,
      mergeVars: envProd,
      numericLiterals: envProd,
      propertyLiterals: envProd,
      removeConsole: envProd,
      removeDebugger: envProd,
      simplify: envProd,
      simplifyComparisons: envProd,
      typeConstructors: envProd,
      undefinedToVoid: envProd,
    }),
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
