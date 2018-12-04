# mocha-typescript

[![Get it on NPM](https://img.shields.io/npm/v/mocha-typescript.svg)](https://www.npmjs.com/package/mocha-typescript)
[![Downloads per Week](https://img.shields.io/npm/dw/mocha-typescript.svg)](https://www.npmjs.com/package/mocha-typescript)
[![Dependencies](https://img.shields.io/librariesio/github/pana-cc/mocha-typescript.svg)](https://libraries.io/npm/mocha-typescript)
[![Issues](https://img.shields.io/github/issues/pana-cc/mocha-typescript.svg)](https://github.com/pana-cc/mocha-typescript/issues)
[![Pull Requests](https://img.shields.io/github/issues-pr/pana-cc/mocha-typescript.svg)](https://github.com/pana-cc/mocha-typescript/pulls)
[![Build Status](https://img.shields.io/travis/pana-cc/mocha-typescript/master.svg)](https://travis-ci.org/pana-cc/mocha-typescript)
![Apache 2.0 License](https://img.shields.io/npm/l/mocha-typescript.svg)

## Set up

### Add mocha-typescript to your existing project

If you already have an npm package with mocha testing integrated just follow the steps prescribed under 
[Installation](../README.md#installation).

Then require mocha-typescript in your test files and you will be good to go

```TypeScript
import { suite, test } from "mocha-typescript";

@suite
class Two {
  
    @test
    method() {}
}
```

### Set up new projects

#### mocha-typescript-seed

[Fork the mocha-typescript-seed repo](https://github.com/pana-cc/mocha-typescript-seed), or clone it:

```
git clone https://github.com/pana-cc/mocha-typescript-seed.git
```

Don't forget to edit the package.json, and check the license.

From that point on, you could

```
npm install
npm test
npm run watch
```

#### Manual Steps

Create a folder, `cd` in the folder, npm init, npm install:

```bash
npm init
npm install mocha typescript mocha-typescript @types/mocha chai @types/chai source-map-support nyc --save-dev
```

Edit the package.json and set the `scripts` section to:

```json
  "scripts": {
    "pretest": "tsc",
    "test": "nyc mocha",
    "watch": "mocha-typescript-watch",
    "prepare": "tsc"
  },
```

You may omit the `nyc` tool and have `"test": "mocha"` instead, `nyc` is the instanbul code coverage reporting tool for
TypeScript.

Add a `tsconfig.json` file with settings similar to:

```
{
    "compilerOptions": {
        "target": "es6",
        "module": "commonjs",
        "sourceMap": true,
        "experimentalDecorators": true,
        "lib": [ "es6" ]
    }
}
```

Create `test` folder and add `test/mocha.opts` file.

```
--ui mocha-typescript
--require source-map-support/register
test/test.js
```

 - Sets the mocha-typescript as custom ui
 - Optionally require the source-map-support/register to have typescript stack traces for Errors
 - Optionally provide test files list, point to specific dist folder, or just use mocha's defaults

Write your first test file `test/test.ts`

```TypeScript
import {suite, test} from "mocha-typescript";

@suite(timeout(3000), slow(1000))
class Hello {
  
    @test
    world() {
    }
}
```

From that point on, you could do

```bash
npm test
```

To run the tests once manually or run all tests constantly while you are developing both your code and tests.

```bash
npm run watch
```

## Test UI API

Please note that the decorators shown below are introduced by importing from the `mocha-typescript` module

```TypeScript
import { suite, test, slow, timeout } from "mocha-typescript";
```

Or by installing `mocha-typescript` as custom mocha test UI.

### Declarative Suites and Tests

Declaring suites is done using the `@suite` decorator and tests within the suite are declared using the `@test`
decorator

```TypeScript
import {suite, test} from "mocha-typescript";

@suite
class Suite {
  
    @test
    test1() {}
}
```

When used without parameters, the names are infered from the class and method name.
Complex names can be provided as arguments to the `@suite` or `@test` decorator:

```TypeScript
import {suite, test} from "mocha-typescript";

@suite("A suite")
class Suite {

    @test("can have tests")
    test() {}
    
    @test
    "typescript also supports this syntax for method naming"() {}
}
```
