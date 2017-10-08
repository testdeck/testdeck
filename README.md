Writing mocha tests with style - OOP style:
``` TypeScript
import { suite, test, slow, timeout } from "mocha-typescript";
@suite class Hello {
    @test world() {
        assert.equal(1, 2, "Expected one to equal two.");
    }
}
```
The test UI will register a suite with tests for the `@suite` and `@test` decorators.
When the tests run, the class will be instantiated once for each `@test` method and the method will be called.

[![Build Status](https://travis-ci.org/pana-cc/mocha-typescript.svg?branch=master)](https://travis-ci.org/pana-cc/mocha-typescript)

 - [Summary](#summary)
    - [Test UI](#test-ui)
    - [Watcher](#watcher)
    - [Thanks To](#thanks-to)
 - [Setting Up](#setting-up)
    - [Adding Mocha-TypeScript to Existing Project](#adding-mocha-typescript-to-existing-project)
    - [Setting up New Project With Custom UI](#setting-up-new-project-with-custom-ui)
       - [mocha-typescript-seed](#mocha-typescript-seed)
       - [Manual Steps](#manual-steps)
    - [Setting Up Dev Test Watcher](#setting-up-dev-test-watcher)
 - [IDEs](#ides)
    - [WebStorm](#webstorm)
 - [Test UI API](#test-ui-api)
    - [Declarative Suites and Tests](#declarative-suites-and-tests)
    - [Generated Suites and Tests](#generated-suites-and-tests)
    - [Before and After Actions](#before-and-after-actions)
    - [Async Tests, Before and After Actions](#async-tests-before-and-after-actions)
    - [Skipped and Only Suite and Tests](#skipped-and-only-suite-and-tests)
    - [Timing - Timeout, Slow](#timing---timeout-slow)
    - [Retries](#retries)
 - [Extending Test Behavior](#extending-test-behavior)
    - [Accessing the Mocha Context Within Class Methods](#accessing-the-mocha-context-within-class-methods)
    - [Skipping Tests In Suite After First Failure - skipOnError](#skipping-tests-in-suite-after-first-failure---skiponerror)

# Summary
## Test UI
The test interface provides support for mocha's built-in tdd, bdd: describe/suite, it/test, timeout, slow, it.only and it.skip;
as well as TypeScript decorators based test UI for classes. You can mix and match:
``` TypeScript
import { suite, test, slow, timeout } from "mocha-typescript";
suite("one", () => {
    test("test", () => {});
});
@suite class Two {
    @test method() {}
}
```
Similarly you can use describe/it:
``` TypeScript
import { suite, test, slow, timeout } from "mocha-typescript";
describe("one", () => {
    it("test", () => {});
});
@suite class Two {
    @test method() {}
}
```
Or even mix the two approaches to get nested suites:
``` TypeScript
import { suite, test, slow, timeout } from "mocha-typescript";
describe("suite one", () => {
    it("test one", () => {});
    @suite class TestTwo {
        @test method() {}
    }
});
```
## Watcher
The `mocha-typescript` comes with a watcher script that runs the TypeScript compiler in watch mode,
and upon successful compilations runs the mocha tests, concatenating the output of both. This in combination with the support for "only":
``` TypeScript
@suite class One {
    @test.only method1() {}
    @test mothod2() {}
}
```
Allows for rapid development of both new functionality and unit tests.

Please note, the built in mocha watcher should work with mocha-typescript UI and the awesome-typescript-loader.

## Thanks to
 - [Haringat](https://github.com/PanayotCankov/mocha-typescript/pull/6) for the async support in before and after methods.
 - [godart](https://github.com/PanayotCankov/mocha-typescript/pull/16) for taking the extra step to support non-default test file paths.

# Setting Up
## Adding Mocha-TypeScript to Existing Project
If you already have an npm package with mocha testing integrated just install `mocha-typescript`:
``` bash
npm i mocha-typescript --save-dev
```
Then require the mocha-typescript in your test files and you will be good to go:
``` TypeScript
import { suite, test, slow, timeout } from "mocha-typescript";
@suite class Two {
    @test method() {}
}
```

## Setting up New Project With Custom UI
### mocha-typescript-seed
[Fork the mocha-typescript-seed repo](https://github.com/pana-cc/mocha-typescript-seed), or clone it:
```
git clone https://github.com/pana-cc/mocha-typescript-seed.git
```

Don't forget to edit the package.json, and check the license.

From that point on, you could:
```
npm i
npm test
npm run watch
```

### Manual Steps
Create a folder, `cd` in the folder, npm init, npm install:
```
npm init
npm install mocha typescript mocha-typescript @types/mocha chai @types/chai source-map-support nyc --save-dev
```
Edit the package.json and set the `scripts` section to:
```
  "scripts": {
    "pretest": "tsc",
    "test": "nyc mocha",
    "watch": "mocha-typescript-watch",
    "prepare": "tsc"
  },
```
You may omit the `nyc` tool and have `"test": "mocha"` instead,
`nyc` is the instanbul code coverage reporting tool.

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
 - Optionally provide test files list, point to specific dist fodler, or skip this to use mocha's defaults
Add your first test file `test/test.ts`:
```
// Reference mocha-typescript's global definitions:
/// <reference path="../node_modules/mocha-typescript/globals.d.ts" />

@suite(timeout(3000), slow(1000))
class Hello {
    @test world() {
    }
}
```
From that point on, you could either:
```
npm test
npm run watch
```
To run the tests once manually or run all tests.
[Keep in mind you can use add `.only` to run a single test](#skipped-and-only-suite-and-tests).

## Setting Up Dev Test Watcher
There is a watcher script in the package, that runs `tsc -w` process and watches its output for successful compilation, upon compilation runs a `mocha` process.

You will need a `tsconfig.json`, and at least `test.ts` mocha entrypoint.

Install `mocha`, `typescript` and `mocha-typescript` as dev dependencies (required):
```
npm install mocha typescript mocha-typescript --save-dev
```

Add the following npm script to `package.json`:
```json
  "scripts": {
    "dev-test-watch": "mocha-typescript-watch"
  },
```

And run the typescript mocha watcher from the terminal using `npm run dev-test-watch`.

You can use the watcher with plain `describe`, `it` functions. The decorator based interface is not required for use with the watcher.

The `mocha-typescript-watch` script is designed as a command line tool.
You can provide the arguments in the package.json's script.
In case you are not using the default `test.js` file as entrypoint for mocha,
you can list the test suite files as arguments to mocha-typescript-watch and they will be passed to mocha.
For example:
```json
  "scripts": {
    "dev-test-watch": "mocha-typescript-watch -p tsconfig.test.json -o mocha.opts dist/test1.js dist/test2.js"
  },
```

For complete list with check `./node_modules/.bin/mocha-typescript-watch --help`: 
```
Options:
  -p, --project  Path to tsconfig file or directory containing tsconfig, passed
                 to `tsc -p <value>`.                    [string] [default: "."]
  -t, --tsc      Path to executable tsc, by default points to typescript
                 installed as dev dependency. Set to 'tsc' for global tsc
                 installation.
                         [string] [default: "./node_modules/typescript/bin/tsc"]
  -o, --opts     Path to mocha.opts file containing additional mocha
                 configuration.          [string] [default: "./test/mocha.opts"]
  -m, --mocha    Path to executable mocha, by default points to mocha installed
                 as dev dependency.
                           [string] [default: "./node_modules/mocha/bin/_mocha"]
  -g, --grep     Passed down to mocha: only run tests matching <pattern>[string]
  -f, --fgrep    Passed down to mocha: only run tests containing <string>
                                                                        [string]
  -h, --help     Show help                                             [boolean]
```
# IDEs
## WebStorm
![WebStorm](docs/assets/WebStorm.png)

JetBrain's stellar WebStorm now (since [WebStorm 2017.3 EAP](https://confluence.jetbrains.com/display/WI/WebStorm+EAP)) supports the mocha-typescript mocha UI. Featuring:
 - Test Explorer - Detects tests in the TypeScript using static analysis.
 - Test Runner - WebStorm has a Mocha test runner that can be configured to also do a TypeScript compilation before test run.
 - Code Editor Integration - In the TypeScript code editor, tests are prefixed with an icon, that lets you:
    - Run a specific test or suite
    - Debug a specific test or suite

The [mocha-typescript-seed](https://github.com/pana-cc/mocha-typescript-seed) has been preconfigured (see the .idea folder in the repo) with `UnitTests` task that will run all mocha tests with the mocha-typescript UI. The UnitTests is configured to run mocha, with TypeScript compilation before launch, use the mocha-typescript mocha UI, as well as include tests in the test folder recursively.

### Tricky
The WebStorm has its own way to define tasks so the configuration for the project is duplicated at few places. Here are some side-effects it would be good for you to be aware of.

Should running/debugging a single test/unit from the TypeScript code editor fail due missing ts-node, consider installing `npm i ts-node --save-dev` to your repo. WebStorm is using ts-node to transpile the file you are testing. This may omit proper type checking or using settings in your tsconfg, but that would rarely be an issue.

Should running/debugging a single test/unit run the test twice, that's because WebStorm provides the file you are editing to mocha as .ts file, but mocha also reads the test/mocha.opts where additional files may be specified. You can either:
 - Nevermind running the test twice
 - Edit the automatically generated single test config from the top tasks menu in WebStorm and change the file extension it points to from .ts to .js, this will use the JavaScript files produced by the TypeScript compilation of your project. But you will have to change the extension by hand each time you debug or run a single test.
 - Change the test/mocha.opts file so it won't reference any files (e.g. delete the `--recursive test` from it). In that case you may need to fix the package.json build scripts.

At few occasions when misxing BDD and the mocha-typescript decorators based UI, trying to run a single BDD test would cause WebStorm to generate a mocha task that would run using BDD ui, instead of mocha-typescript. In these cases the tests may fail as there is no `suite` or `test` functions defined in the BDD UI. To fix this you may edit the default Mocha task, and configure it to use mocha-typescript UI explicitly. From that point on, when you try to run a single test, event BDD one, WebStorm will create Mocha tasks that will use the mocha-typescript UI. 

# Test UI API
Please note that the methods and decorators used below are introduced through importing from the `mocha-typescript` module:
``` TypeScript
import { suite, test, slow, timeout } from "mocha-typescript";
```
Or by installing `mocha-typescript` as custom mocha test UI.

## Declarative Suites and Tests
Declaring suites is done using the `@suite` decorator and tests within the suite using the `@test` decorator:
``` TypeScript
@suite class Suite {
    @test test1() {}
}
```
When used without parameters, the names are infered from the class and method name.
Complex names can be provided as arguments to the `@suite` or `@test` decorator:
``` TypeScript
@suite("A suite")
class Suite {
    @test("can have tests") {}
    @test "typescript also supports this syntax for method naming"() {}
}
```

## Generated Suites and Tests
Mocha's simple interface is very flexible when tests have to be dynamically generated.
If tests for classes have to be generated dynamically here is an example:
``` TypeScript
[{ title: 'google', url: 'www.google.com' },
 { title: 'github', url: 'www.github.com' }
].forEach(({title, url}) => {
    @suite(`Http ${title}`) class GeneratedTestClass {
        @test login() {}
        @test logout() {}
    }
});
```

## Before and After Actions
By default, before and after test actions are implemented with instance and static before and after methods.
The static before and after methods are invoked before the suite and after the suite,
the instance before and after methods are invoked before and after each test method.
``` TypeScript
@suite class Suite {
    static before() { /* 1 */ }
    before() { /* 2, 5 */ }
    @test one() { /* 3 */ }
    @test one() { /* 6 */ }
    after() { /* 4, 7 */ }
    static after() { /* 8 */ }
}
```

## Async Tests, Before and After Actions
The methods that accept a `done` callback or return a `Promise` are considered async similar and their execution is similar to the one in mocha.
 - For `done`, calling it without params marks the test as passed, calling it with arguments fails the test.
 - For returned `Promise`, the test passes is the promise is resolved, the test fails if the promise is rejected.
``` TypeScript
@suite class Suite {
    @test async1(done) {
        setTimeout(done, 1000);
    }
    @test async2() {
        return new Promise((resolve, reject) => setTimeout(resolve, 1000));
    }
    @test async async3() {
        // async/await FTW!
        await something();
    }
}
```

## Skipped and Only Suite and Tests
Marking a test as pending or marking it as the only one to execute declaratively is done using `@suite.skip`, `@suite.only`, `@test.skip` or `@test.only` similar to the mocha interfaces:
``` TypeScript
@suite.only class SuiteOne {
    @test thisWillRun() {}
    @test.skip thisWillNotRun() {}
}
@suite class SuiteTwo {
    @test thisWillNotRun() {}
}
```
The signatures for the skip and only are the same as the suite and test counterpart so you can switch between `@suite.only(args)` and `@suite(args)` with ease.

If running in watch mode it may be common to focus a particular test file in your favourite IDE (VSCode, vim, whatever),
and mark the suite or the tests you are currently developing with `only` so that the mocha-typescript watcher would trigger just the tests you are focused on.
When you are ready, remove the `only` to have the watcher execute all tests again.

## Timing - Timeout, Slow
Controlling the time limits, similar to the `it("test", function() { this.slow(ms); /* ... */ });` is done using suite or test traits,
these are modifiers passed as arguments to the `@suite()` and `@test()` decorators:
``` TypeScript
@suite(slow(1000), timeout(2000))
class Suite {
    @test first() {}
    @test(slow(2000), timeout(4000)) second() {}
}
```
The `slow` and `timeout` traits were initially working as decorators (e.g. `@suite @timeout(200) class Test {}`),
but this behavior may be dropped in future major versions as it generates too much decorators that clutter the syntax.
They are still useful though for setting timeouts on before and after methods (e.g. `@suite class Test { @timeout(100) before() { /* ... */ }}`).

## Retries
I would not recomend retrying failed tests multiple times to ensure green light but I also wouldn't judge, here it goes mocha-typescript retries:
``` TypeScript
@suite(retries(2))
class Suite {
    static tries1 = 0;
    static tries2 = 0;
    @test first() {
        assert.isAbove(Suite.tries1++, 2);
    }
    @test(retries(5)) second() {
        assert.isAbove(Suite.tries1++, 3);
    }
}
```
The retries can also be used as a decorator similar to `timeout` and `slow` - `@test @retries(3) testMethod() {}`.

# Extending Test Behavior
## Accessing the Mocha Context Within Class Methods
There are various aspects of the suites and tests that can be altered via the mocha context.
Within the default mocha 'BDD' style this is done through the callback's `this` object.
That object is exposed to the TypeScript decorators based UI through a field decorated with the `@context` decorator:
```
@suite class MyClass {
  @context mocha; // Set for instenace methods such as tests and before/after
  static @context mocha; // Set for static methods such as static before/after (mocha bdd beforeEach/afterEach)
  after() {
    this.mocha.currentTest.state;
  }
}
```

## Skipping Tests In Suite After First Failure - skipOnError
In functional testing it is sometimes fine to skip the rest of the suite when one of the tests fail.
Consider the case of a web site tests where the login test fail and subsequent tests that depend on the login will hardly pass.
This can be done with the `skipOnError` suite trait:
```
@suite(skipOnError)
class StockSequence {
    @test step1() {}
    @test step2() { throw new Error("Failed"); }
    @test step3() { /* will be skipped */ }
    @test step4() { /* will be skipped */ }
}
```
