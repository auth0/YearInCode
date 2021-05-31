module.exports = {
  preset: '../jest.config.js',
  setupFiles: ['<rootDir>/tests/setupBeforeEnv.ts'],
  setupFilesAfterEnv: ['<rootDir>/tests/setupTests.js'],
  globalSetup: '@shelf/jest-dynamodb/setup.js',
  globalTeardown: '@shelf/jest-dynamodb/teardown.js',
  testEnvironment: '@shelf/jest-dynamodb/environment.js',
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  moduleNameMapper: {
    '\\.svg': '<rootDir>/__mocks__/svgrMock.js',
  },
}
