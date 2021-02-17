module.exports = {
  preset: '../jest.config.js',
  setupFiles: ['<rootDir>/tests/setupBeforeEnv.ts'],
  setupFilesAfterEnv: ['<rootDir>/tests/setupTests.js'],
  testEnvironment: 'node',
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  moduleNameMapper: {
    '\\.svg': '<rootDir>/__mocks__/svgrMock.js',
  },
}
