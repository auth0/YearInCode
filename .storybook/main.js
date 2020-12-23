const path = require('path')
const fs = require('fs')

module.exports = {
  stories: [
    '../components/**/*.stories.mdx',
    '../components/**/*.stories.@(js|jsx|ts|tsx)',
  ],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    'storybook-css-modules-preset',
  ],
  webpackFinal: async config => {
    const ROOT_DIR = process.cwd()

    const directories = fs
      .readdirSync(ROOT_DIR, {withFileTypes: true})
      .filter(file => file.isDirectory() && file.name[0] !== '.')
      .map(file => file.name)

    directories.forEach(directory => {
      config.resolve.alias[`@${directory}`] = path.join(ROOT_DIR, directory)
    })

    let rule = config.module.rules.find(
      r =>
        r.test &&
        r.test.toString().includes('svg') &&
        r.loader &&
        r.loader.includes('file-loader'),
    )
    rule.test = /\.(ico|jpg|jpeg|png|gif|eot|otf|webp|ttf|woff|woff2|cur|ani)(\?.*)?$/

    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    })

    return config
  },
}
