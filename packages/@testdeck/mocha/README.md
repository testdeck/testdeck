## @testdeck/mocha

[![Get it on NPM](https://img.shields.io/npm/v/@testdeck/mocha.svg)](https://www.npmjs.com/package/@testdeck/mocha)
[![Downloads per Week](https://img.shields.io/npm/dw/@testdeck/mocha.svg)](https://www.npmjs.com/package/@testdeck/mocha)
[![Issues](https://img.shields.io/github/issues/testdeck/testdeck.svg)](https://github.com/testdeck/testdeck/issues)
[![Pull Requests](https://img.shields.io/github/issues-pr/testdeck/testdeck.svg)](https://github.com/testdeck/testdeck/pulls)
[![Travis Build Status](https://img.shields.io/travis/testdeck/testdeck/master.svg)](https://travis-ci.org/testdeck/testdeck)
[![Appveyor Build Status](https://img.shields.io/appveyor/ci/pana-cc/testdeck.svg)](https://ci.appveyor.com/project/pana-cc/testdeck)
![Apache 2.0 License](https://img.shields.io/npm/l/@testdeck/mocha.svg)

Mocha testing with style - the OOP way

```TypeScript
import { suite, test } from "@testdeck/mocha";
import { expect } from 'chai';

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


## Installation

```shell
npm install --save-dev @types/mocha mocha @testdeck/mocha
```

Additional dependencies need to be installed, unless you use the seed below or follow the instructions in the setup
guide for which a link has been provided below.

## Getting Started

To get you started, a [seed has been provided](https://github.com/testdeck/testdeck-mocha-seed) that can help you with
setting up your project.

```shell
git clone https://github.com/testdeck/testdeck-mocha-seed.git
```

## Additional Information

You can find a lot more information in the [official documentation](https://testdeck.org/), especially in the
[setup guide](https://testdeck.org/pages/guide/setup).
