[![Get it on NPM](https://img.shields.io/npm/v/@testdeck/jest.svg)](https://www.npmjs.com/package/@testdeck/jest)
[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![Build Status](https://github.com/testdeck/testdeck/actions/workflows/ci.yml/badge.svg)](https://github.com/testdeck/testdeck/actions/workflows/ci.yml)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=testdeck_jest&metric=coverage)](https://sonarcloud.io/summary/new_code?id=testdeck_jest)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=testdeck_jest&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=testdeck_jest)
[![Issues](https://img.shields.io/github/issues/testdeck/testdeck/@testdeck/jest)](https://github.com/testdeck/testdeck/issues)
[![Pull Requests](https://img.shields.io/github/issues-pr/testdeck/testdeck/@testdeck/jest)](https://github.com/testdeck/testdeck/pulls)

# ![Testdeck](https://raw.githubusercontent.com/testdeck/testdeck/main/docs/assets/testdeck-wide.svg)

## @testdeck/jest

The package provides a suite of decorators to integrate your favorite test framework into an object-oriented workflow.

## Object-Oriented API Usage
With Testdeck, writing object-oriented test suites is just a blaze.

``` TypeScript
import { suite, test } from "@testdeck/jest";

class TestBase {
  @test
  basic() {
    // expected fail :/
    expect(true).toBe(false);
  }
}

@suite
class Hello extends TestBase {
  @test
  world() {
    // expected fail :/
    expect(false).toBe(true);
  }
}
```

## Standard Functional API Usage
With Testdeck, you can always use the standard functional test framework API:

``` TypeScript
function basic() {
  it('basic', () => {
    // expected fail :/
    expect(true).toBe(false);
  });
}

describe('Hello', () => {
  basic();
  it('world', () => {
    // expected fail :/
    expect(false).toBe(true);
  });
})
```

And you can migrate your existing functional test suites to object-oriented over time.

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
