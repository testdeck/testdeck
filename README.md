[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![Build Status](https://github.com/testdeck/testdeck/actions/workflows/ci.yml/badge.svg)](https://github.com/testdeck/testdeck/actions/workflows/ci.yml)
[![Issues](https://img.shields.io/github/issues/testdeck/testdeck.svg)](https://github.com/testdeck/testdeck/issues)
[![Pull Requests](https://img.shields.io/github/issues-pr/testdeck/testdeck.svg)](https://github.com/testdeck/testdeck/pulls)

# ![Testdeck](https://raw.githubusercontent.com/testdeck/testdeck/main/docs/assets/testdeck-wide.svg)

Testdeck is a suite of decorators to integrate your favorite test framework into an object-oriented workflow:
- [Mocha](https://mochajs.org)
- [Jasmine](https://jasmine.github.io)
- [Jest](https://jestjs.io)
- [Vitest](https://vitest.dev)

## Object-Oriented API Usage
With Testdeck, writing object-oriented test suites is just a blaze.

``` TypeScript
import { suite, test } from "@testdeck/mocha";
import { expect } from 'chai';

class TestBase {
  @test
  basic() {
    // expected fail :/
    expect(true).to.equal(false);
  }
}

@suite
class Hello extends TestBase {
  @test
  world() {
    // expected fail :/
    expect(false).to.equal(true);
  }
}
```

## Standard Functional API Usage
With Testdeck, you can always use the standard functional test framework API:

``` TypeScript
import { expect } from 'chai';

function basic() {
  it('basic', () => {
    // expected fail :/
    expect(true).to.equal(false);
  });
}

describe('Hello', () => {
  basic();
  it('world', () => {
    // expected fail :/
    expect(false).to.equal(true);
  });
})
```

And you can migrate your functional test suites to object-oriented over time.

## Further Reading

- [Documentation](https://testdeck.org)
- [CHANGELOG](https://github.com/testdeck/testdeck/blob/main/CHANGELOG.md)
- [LICENSE](https://github.com/testdeck/testdeck/blob/main/LICENSE)

## License

```
Copyright 2016-2022 Testdeck Team and Contributors

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
```

## Packages
Testdeck is the monorepo for the following packages:

- [@testdeck/core](https://github.com/testdeck/testdeck/tree/main/packages/core)

  Used for integrating [new] test frameworks and IOC frameworks.
- [@testdeck/mocha](https://github.com/testdeck/testdeck/tree/main/packages/mocha)

  Mocha test framework integration.
- [@testdeck/jasmine](https://github.com/testdeck/testdeck/tree/main/packages/jasmine)

  Jasmine test framework integration.
- [@testdeck/jest](https://github.com/testdeck/testdeck/tree/main/packages/jest)

  Jest test framework integration.
- [@testdeck/vitest](https://github.com/testdeck/testdeck/tree/main/packages/vitest)

  Vitest test framework integration.
- [@testdeck/di-typedi](https://github.com/testdeck/testdeck/tree/main/packages/di-typedi)

  TypeDI IOC container integration.
