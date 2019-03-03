module.exports = {
  preset: 'ts-jest',
  testMatch: null, // required by ts-jest
  coverageThreshold: {
    global: {
      branches: 95,
      functions: 95,
      lines: 95,
      statements: 95
    }
  }
};
