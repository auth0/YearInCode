module.exports = {
  preset: 'ts-jest/presets/js-with-babel',
  globals: {
    'ts-jest': {
      babelConfig: './.babelrc',
    },
  },
  roots: ['<rootDir>'],
  moduleDirectories: ['node_modules', __dirname],
  collectCoverageFrom: [
    '**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/*.stories.{js,jsx,ts,tsx}',
  ],
  setupFiles: ['<rootDir>/tests/setupEnv.ts'],
  setupFilesAfterEnv: ['<rootDir>/tests/setupTests.js'],
  testPathIgnorePatterns: ['/node_modules/', '/.next/'],
  moduleNameMapper: {
    '@tests/(.*)$': '<rootDir>/tests/$1',
    '@lib/(.*)$': '<rootDir>/src/lib/$1',
    '@nebula/(.*)$': '<rootDir>/libs/$1',
    '@api/(.*)$': '<rootDir>/api/$1',
  },
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname',
  ],
}
