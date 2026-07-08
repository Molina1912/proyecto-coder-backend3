export default {
  testEnvironment: 'node',
  transform: {},
  moduleFileExtensions: ['js'],
  testMatch: ['**/tests/**/*.test.js'],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/app.js',
    '!src/config/**/*.js'
  ],
  coverageDirectory: 'coverage',
  verbose: true,
  testTimeout: 10000
};