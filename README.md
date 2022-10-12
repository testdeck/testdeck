[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![Build Status](https://github.com/testdeck/testdeck/actions/workflows/ci.yml/badge.svg)](https://github.com/testdeck/testdeck/actions/workflows/ci.yml)
[![Issues](https://img.shields.io/github/issues/testdeck/testdeck.svg)](https://github.com/testdeck/testdeck/issues)
[![Pull Requests](https://img.shields.io/github/issues-pr/testdeck/testdeck.svg)](https://github.com/testdeck/testdeck/pulls)

# testdeck

# @testdeck

Object oriented javascript / typescript testing.

```typescript
import { suite, test } from "@testdeck/mocha";

import { expect } from 'chai';

// Turn your standard tests
describe("Hello", function() {
  it("world", function() {
    expect(false).to.be.true;
  });
});

// into 100% OOP awesomeness
@Suite()
class Hello {
  @Test()
  world() {
    expect(false).to.be.true;
  }
}
```

## Packages
This is the `@testdeck` monorepo.

- [@testdeck/mocha](./packages/mocha)
- [@testdeck/jasmine](./packages/jasmine)
- [@testdeck/jest](./packages/jest)
- [@testdeck/vitest](./packages/vitest)
- [@testdeck/di-typedi](./packages/di-typedi)
- [@testdeck/core](./packages/core)

## Build

Clone this repository using

```
git clone https://github.com/testdeck/testdeck.git
```

Then from inside the so created `testdeck` directory run

```
npm install
```

This will bootstrap `lerna` and install all external (dev) dependencies.

The following npm scripts are available

- `build`     -- runs the build script in all packages
- `clean`     -- runs the clean script in all packages
- `clean-all` -- runs the clean-all script in all packages (requires `npm install` afterwards)
- `lint`      -- runs the lint script in all packages
- `lint-fix`  -- runs the lint-fix script in all packages
- `test`      -- runs the test script in all packages

## Resources

- [Official Documentation](https://testdeck.org)
- [Usage: npm-stat.js](https://npm-stat.com/charts.html?package=mocha-typescript&package=%40testdeck%2Fdi-typedi&package=%40testdeck%2Fjest&package=%40testdeck%2Fmocha&package=%40testdeck%2Fjasmine&package=%40testdeck%2Fvitest)
