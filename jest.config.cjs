module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/test/setup.js'],
  testMatch: ['<rootDir>/src/__tests__/**/*.test.[jt]s?(x)'],
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest',
  },
  moduleNameMapper: {
    '\\.(css)$': '<rootDir>/src/test/styleMock.cjs',
  },
  clearMocks: true,
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/main.jsx',
    '!src/test/**',
    '!src/__tests__/**',
  ],
  coverageDirectory: 'coverage',
};
