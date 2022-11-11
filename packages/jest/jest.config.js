/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testRegex: ['(.*)test.ts'],
  testPathIgnorePatterns: ['dist', 'node_modules'],
  verbose: true,
  collectCoverage: true,
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 100,
      lines: 84,
      statements: 84
    }
  }
};
