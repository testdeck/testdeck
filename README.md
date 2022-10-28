# testdeck

[![Issues](https://img.shields.io/github/issues/testdeck/testdeck.svg)](https://github.com/testdeck/testdeck/issues)
[![Pull Requests](https://img.shields.io/github/issues-pr/testdeck/testdeck.svg)](https://github.com/testdeck/testdeck/pulls)
[![Build Status](https://github.com/testdeck/testdeck/actions/workflows/main.yml/badge.svg)](https://github.com/testdeck/testdeck/actions/workflows/main.yml)
![Apache 2.0 License](https://img.shields.io/npm/l/@testdeck/jest.svg)

The JavaScript OOP style tests!

``` TypeScript
// Use one of the mocha/jest/jasmine test runners:
import { suite, test } from "@testdeck/mocha";
import { suite, test } from "@testdeck/jest";
import { suite, test } from "@testdeck/jasmine";

import { expect } from 'chai';

// And turn your tests from functional:
describe("Hello", function() {
  it("world", function() {
    expect(false).to.be.true;
  });
});

// Into 100% OOP awesomeness:
@suite class Hello {
  @test world() {
    expect(false).to.be.true;
  }
}

// P.S. You can still mix and match!
```

## Packages
This is the monorepo for the testdeck packages.

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

This will install all required dependencies and will also bootstrap `lerna`.

The following npm scripts are available

- `npm run tslint`      -- runs `tslint` on all sources in all available packages
- `npm run tslint-fix`  -- runs `tslint --fix` on all sources in all available packages
- `npm test`            -- run all tests on all available packages

## Resources

- [Official Documentation](https://testdeck.org)
- [Usage: npm-stat.js](https://npm-stat.com/charts.html?package=mocha-typescript&package=%40testdeck%2Fdi-typedi&package=%40testdeck%2Fjest&package=%40testdeck%2Fmocha&package=%40testdeck%2Fjasmine&package=%40testdeck%2Fvitest)
