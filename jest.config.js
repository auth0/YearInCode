module.exports = {
  moduleDirectories: ['node_modules', __dirname],
  collectCoverageFrom: [
    '**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/*.stories.{js,jsx,ts,tsx}',
  ],
  setupFiles: ['<rootDir>/tests/setupBeforeEnv.ts'],
  setupFilesAfterEnv: ['<rootDir>/tests/setupTests.js'],
  testPathIgnorePatterns: ['/node_modules/', '/.next/'],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': '<rootDir>/node_modules/babel-jest',
  },
  moduleNameMapper: {
    '@tests/(.*)$': '<rootDir>/tests/$1',
    '@lib/(.*)$': '<rootDir>/src/lib/$1',
    '@nebula/(.*)$': '<rootDir>/libs/$1',
    '@api/(.*)$': '<rootDir>/api/$1',
    '@web/(.*)$': '<rootDir>/src/$1',
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
