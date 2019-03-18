module.exports = {
  preset: 'ts-jest',
  testMatch: null, // required by ts-jest
  coveragePathIgnorePatterns: [
    'test/'
  ],
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90
    }
  }
};
