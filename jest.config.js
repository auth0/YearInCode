module.exports = {
  moduleDirectories: ['node_modules', __dirname],
  collectCoverageFrom: [
    '**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/*.stories.{js,jsx,ts,tsx}',
  ],
  setupFiles: ['<rootDir>/src/test/setupEnv.ts'],
  setupFilesAfterEnv: ['<rootDir>/src/test/setupTests.js'],
  testPathIgnorePatterns: ['/node_modules/', '/.next/'],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': '<rootDir>/node_modules/babel-jest',
  },
  moduleNameMapper: {
    '@test/(.*)$': '<rootDir>/src/test/$1',
    '@lib/(.*)$': '<rootDir>/src/lib/$1',
    '@nebula/(.*)$': '<rootDir>/libs/$1',
  },
  transformIgnorePatterns: [
    '/node_modules/',
    '^.+\\.module\\.(css|sass|scss)$',
  ],
}
