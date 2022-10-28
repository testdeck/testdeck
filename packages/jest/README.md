## @testdeck/jest

[![Get it on NPM](https://img.shields.io/npm/v/@testdeck/jest.svg)](https://www.npmjs.com/package/@testdeck/jest)
[![Downloads per Week](https://img.shields.io/npm/dw/@testdeck/jest.svg)](https://www.npmjs.com/package/@testdeck/jest)
[![Issues](https://img.shields.io/github/issues/testdeck/testdeck.svg)](https://github.com/testdeck/testdeck/issues)
[![Pull Requests](https://img.shields.io/github/issues-pr/testdeck/testdeck.svg)](https://github.com/testdeck/testdeck/pulls)
[![Build Status](https://github.com/testdeck/testdeck/actions/workflows/main.yml/badge.svg)](https://github.com/testdeck/testdeck/actions/workflows/main.yml)
![Apache 2.0 License](https://img.shields.io/npm/l/@testdeck/jest.svg)

Jest tests in OOP style!

```TypeScript
import { suite, test } from "@testdeck/jest";

@suite
class Hello {

  @test
  world() {
    expect(false).toBe(true);
  }
}
```

With support for

- test suite inheritance by either extension or mixins
- individual naming of both suites and tests
- parameterised tests

and more...

If you are looking for other test framework support, please see the following packages

- [@testdeck/jasmine](https://npmjs.com/package/@testdeck/jasmine)
- [@testdeck/mocha](https://npmjs.com/package/@testdeck/mocha)
- [@testdeck/vitest](https://npmjs.com/package/@testdeck/vitest)


## Installation

```shell
npm install --save-dev @types/jest jest @testdeck/jest
```

Additional dependencies need to be installed, unless you use the seed below or follow the instructions in the setup
guide for which a link has been provided below.

## Getting Started

To get you started, a [seed has been provided](https://github.com/testdeck/testdeck-jest-seed) that can help you with
setting up your project.

```shell
git clone https://github.com/testdeck/testdeck-jest-seed.git
```

## Additional Information

You can find a lot more information in the [official documentation](https://testdeck.org/), especially in the
[setup guide](https://testdeck.org/pages/guide/setup).
