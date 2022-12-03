[![Get it on NPM](https://img.shields.io/npm/v/@testdeck/vitest.svg)](https://www.npmjs.com/package/@testdeck/vitest)
[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![Build Status](https://github.com/testdeck/testdeck/actions/workflows/ci.yml/badge.svg)](https://github.com/testdeck/testdeck/actions/workflows/ci.yml)
[![Issues](https://img.shields.io/github/issues/testdeck/testdeck/@testdeck/vitest)](https://github.com/testdeck/testdeck/issues)
[![Pull Requests](https://img.shields.io/github/issues-pr/testdeck/testdeck/@testdeck/vitest)](https://github.com/testdeck/testdeck/pulls)

## @testdeck/vitest

Vitest tests in OOP style!

```TypeScript
import { suite, test } from "@testdeck/vitest";
import { expect } from "chai";

@suite
class Hello {

  @test
  world() {
    expect(false).to.be.true;
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
- [@testdeck/jest](https://npmjs.com/package/@testdeck/jest)
- [@testdeck/mocha](https://npmjs.com/package/@testdeck/mocha)

## Installation

```shell
npm install --save-dev @types/jest jest @testdeck/jest
```

Additional dependencies need to be installed, unless you use the seed below or follow the instructions in the setup
guide for which a link has been provided below.

## Getting Started

To get you started, a [seed has been provided](https://github.com/testdeck/testdeck-vitest-seed) that can help you with
setting up your project.

```shell
git clone https://github.com/testdeck/testdeck-vitest-seed.git
```

## Additional Information

You can find a lot more information in the [official documentation](https://testdeck.org/), especially in the
[setup guide](https://testdeck.org/pages/guide/setup).
