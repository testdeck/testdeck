Writing mocha tests with style - OOP style:
```
import { suite, test, slow, timeout, skip, only } from "mocha-typescript";
@suite class Hello {
    @test world() { }
}
```

[![Build Status](https://travis-ci.org/pana-cc/mocha-typescript.svg?branch=master)](https://travis-ci.org/pana-cc/mocha-typescript)

 - [Summary](#summary)
    - [Test UI](#decorators)
    - [Watcher](#watcher)
    - [Thanks To](#thanks-to)
 - [Test UI API](#test-ui-api)
    - [Declarative Suites and Tests](#declarative-suites-and-tests)
> TODO: ToC

# Summary
## Test UI
The test interface provides support for mocha's built-in tdd, bdd: describe/suite, it/test, timeout, slow, it.only and it.skip;
as well as TypeScript decorators based test UI for classes. You can mix and match:
```
import { suite, test, slow, timeout, skip, only } from "mocha-typescript";
suite("one", () => {
    test("test", () => {});
});
@suite class Two {
    @test method() {}
}
```

## Watcher
The `mocha-typescript` comes with a watcher script that runs the TypeScript compiler in watch mode,
and upon successful compilations runs the mocha tests, concatinating the output of both. This in combination with the support for "only":
```
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

# Test UI API
Please note that the methods and decorators used below are introduced through importing from the `mocha-typescript` module:
```
import { suite, test, slow, timeout } from "mocha-typescript";
```
Or by installing `mocha-typescript` as custom mocha test UI.

## Declarative Suites and Tests
Declaring suites is done using the `@suite` decorator and tests within the suite using the `@test` decorator:
```
@suite class Suite {
    @test test1() {}
}
```
When used without parameters, the names are infered from the class and method name.
Complex names can be provided as arguments to the `@suite` or `@test` decorator:
```
@suite("A suite")
class Suite {
    @test("can have tests") {}
    @test "typescript also supports this syntax for method naming"() {}
}
```

## Generated Suites and Tests
Mocha's simple interface is very flexible when test have to be dynamically generated.
If tests for classes have to be generated dinamically here is an example:
```
[{ title: "google", url: "www.google.com" },
 { title: "github", url: "www.github.com" }
].forEach({title, url} => {
    @class(`Http ${title}`) OAuthTests {
        @test login() {}
        @test logout() {}
    }
});
```

## Before and After Actions
By default, before and after test actions are implemented with instance and static before and after methods.
The static before and after methods are invoked before the suite and after the suite,
the instance before and after methods are infvoked before and after each test method.
```
@suite class Suite {
    static before() { /* 1 */ }
    before() { /* 2, 5 */ }
    @test one() { /* 3 */ }
    @test one() { /* 6 */ }
    after() { /* 4, 7 */ }
    static after() { /* 8 */ }
}
```

## Async
The methods that accept a `done` callback or return a `Promise` are considered async similar and their execution is similar to the one in mocha.
 - For `done`, calling it without params marks the test as passed, calling it with arguments fails the test.
 - For returned `Promise`, the test passes is the promise is resolved, the test fails if the promise is rejected.
```
@suite class Suite {
    @test async1(done) {
        setTimeout(done, 1000);
    }
    @test async2() {
        new Promise((resolve, reject) => setTimeout(resolve, 1000));
    }
    @test async async3() {
        // async/await FTW!
        await something();
    }
}
```

## Skipped and Only Suite and Tests
Marking a test as pending or skipped declaratively is done using `@suite.skip`, `@suite.only`, `@test.skip` or `@test.only` similar to the mocha interfaces:
```
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
```
@suite(slow(1000), timeout(2000))
class Suite {
    @test first() {}
    @test(slow(2000), timeout(4000)) {}
}
```
The `slow` and `timeout` traits were initially working as decorators (e.g. `@suite @timeout(200) class Test {}`),
but this behavior may be dropped in future major versinos as it generates too much decorators that cluter the syntax.
They are still useful though for setting timeouts on before and after methods (e.g. `@suite class Test { @timeout(100) before() { /* ... */ }}`).

# Setting Up
## Mocha TypeScript and Mocha-TypeScript Unit Testing
In the terminal run:
```
mkdir mocha-ts-use
cd mocha-ts-use

npm init
# then multiple enter hits

npm install typescript --save-dev
npm install mocha --save-dev
npm install mocha-typescript --save-dev
```

In the `package.json` add:
```json
  "scripts": {
    "test": "tsc -p . && mocha",
    "prepublish": "tsc -p ."
  },
```

Create `tsconfig.json` file near the `package.json` like that:
```json
{
    "compilerOptions": {
        "module": "commonjs",
        "removeComments": false,
        "preserveConstEnums": true,
        "sourceMap": true,
        "experimentalDecorators": true,
        "declaration": true
    }
}
```

Add a `test.ts` file:
```TypeScript
import { suite, test, slow, timeout, skip, only } from "mocha-typescript";

@suite class Hello {
    @test "world"() { }
}
```

Back to the terminal:
```
npm test
```

Now you have tests for the code you are about to write.

Mind adding `.npmignore` and `.gitignore` to keep `.ts` files in `git`,
and `.js` and `.d.ts` files in `npm`.

## Test Watcher
There is a watcher script in the package, that runs `tsc -w` process and watches its output for successful compilation, upon compilation runs a `mocha` process.

You will need a `tsconfig.json`, and at least `test.ts` mocha entrypoint.

Install `mocha`, `typescript` and `mocha-typescript` as dev dependencies (required):
```
npm install typescript --save-dev
npm install mocha --save-dev
npm install mocha-typescript --save-dev
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