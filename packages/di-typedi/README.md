[![Get it on NPM](https://img.shields.io/npm/v/@testdeck/di-typedi.svg)](https://www.npmjs.com/package/@testdeck/di-typedi)
[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![Build Status](https://github.com/testdeck/testdeck/actions/workflows/ci.yml/badge.svg)](https://github.com/testdeck/testdeck/actions/workflows/ci.yml)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=testdeck_di-typedi&metric=coverage)](https://sonarcloud.io/summary/new_code?id=testdeck_di-typedi)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=testdeck_di-typedi&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=testdeck_di-typedi)
[![Issues](https://img.shields.io/github/issues/testdeck/testdeck/@testdeck/di-typedi)](https://github.com/testdeck/testdeck/issues)
[![Pull Requests](https://img.shields.io/github/issues-pr/testdeck/testdeck/@testdeck/di-typedi)](https://github.com/testdeck/testdeck/pulls)

## @testdeck/di-typedi

Integration of the TypeDI IOC.

```TypeScript
import { suite, test } from "@testdeck/mocha";
import { expect } from "chai";

// register TypeDI support with testdeck and also let reflect-metadata do it's magic
import "@testdeck/di-typedi";
import "reflect-metadata";

import { Service } from "typedi";

@Service()
class SomeService {

  doSomething(): boolean {

    return false;
  }
}

@suite
class Hello {

  constructor(private service: SomeService) {
  }

  @test
  world() {
    expect(this.service.doSomething()).to.be.true;
  }
}
```

This also works with the provided integrations for Jasmine and Jest.

If you are looking for other test framework support, please see the following packages

- [@testdeck/mocha](https://npmjs.com/package/@testdeck/mocha)
- [@testdeck/jasmine](https://npmjs.com/package/@testdeck/jasmine)
- [@testdeck/jest](https://npmjs.com/package/@testdeck/jest)

## Installation

```shell
npm install --save-dev typedi reflect-metadata @testdeck/di-typedi
```

## Additional Information

You can find a lot more information in the [official documentation](https://testdeck.org/).

Read more about [TypeDI](https://github.com/typestack/typedi).
