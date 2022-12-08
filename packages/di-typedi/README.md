[![Get it on NPM](https://img.shields.io/npm/v/@testdeck/di-typedi.svg)](https://www.npmjs.com/package/@testdeck/di-typedi)
[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![Build Status](https://github.com/testdeck/testdeck/actions/workflows/ci.yml/badge.svg)](https://github.com/testdeck/testdeck/actions/workflows/ci.yml)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=testdeck_di_typedi&metric=coverage)](https://sonarcloud.io/summary/new_code?id=testdeck_di-typedi)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=testdeck_di_typedi&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=testdeck_di-typedi)
[![Issues](https://img.shields.io/github/issues/testdeck/testdeck/@testdeck/di-typedi)](https://github.com/testdeck/testdeck/issues)
[![Pull Requests](https://img.shields.io/github/issues-pr/testdeck/testdeck/@testdeck/di-typedi)](https://github.com/testdeck/testdeck/pulls)

# ![Testdeck](https://raw.githubusercontent.com/testdeck/testdeck/main/docs/assets/testdeck-wide.svg)

## @testdeck/di-typedi

The package integrates the TypeDI IOC container.

## Object-Oriented API Usage
With Testdeck, writing object-oriented test suites is just a blaze.

```TypeScript
import { suite, test } from "@testdeck/mocha";
import { expect } from "chai";

// register TypeDI support with testdeck and also let reflect-metadata do it's magic
import "@testdeck/di-typedi";
import "reflect-metadata";

import { Service } from "typedi";

@Service()
class EchoService {
  echo(message: string): string {
    return message;
  }
}

@suite
@Service()
class EchoServiceSuite {
  constructor(private service: EchoService) { }

  @test
  echo() {
    expect(this.service.echo("hello world")).to.equal("hello world");
  }
}
```

This also works with the provided integrations for Jasmine, Jest, and Vitest.

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
