const {pathsToModuleNameMapper} = require('ts-jest/utils')

const {compilerOptions} = require('./tsconfig')

module.exports = {
  projects: ['<rootDir>/src', '<rootDir>/api'],
  moduleDirectories: ['node_modules', __dirname],
  collectCoverageFrom: [
    '**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/*.stories.{js,jsx,ts,tsx}',
  ],
  testPathIgnorePatterns: ['/node_modules/', '/.next/'],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
    '^.+\\.svg$': 'jest-svg-transformer',
  },
  moduleNameMapper: {
    ...pathsToModuleNameMapper(compilerOptions.paths),
    '^.+\\.css$': 'jest-css-modules',
  },
  transformIgnorePatterns: [
    '/node_modules/',
    '^.+\\.module\\.(css|sass|scss)$',
  ],
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname',
  ],
}
