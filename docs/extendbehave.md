# mocha-typescript

[![Get it on NPM](https://img.shields.io/npm/v/mocha-typescript.svg)](https://www.npmjs.com/package/mocha-typescript)
[![Downloads per Week](https://img.shields.io/npm/dw/mocha-typescript.svg)](https://www.npmjs.com/package/mocha-typescript)
[![Dependencies](https://img.shields.io/librariesio/github/pana-cc/mocha-typescript.svg)](https://libraries.io/npm/mocha-typescript)
[![Issues](https://img.shields.io/github/issues/pana-cc/mocha-typescript.svg)](https://github.com/pana-cc/mocha-typescript/issues)
[![Pull Requests](https://img.shields.io/github/issues-pr/pana-cc/mocha-typescript.svg)](https://github.com/pana-cc/mocha-typescript/pulls)
[![Travis Build Status](https://img.shields.io/travis/pana-cc/mocha-typescript/master.svg)](https://travis-ci.org/pana-cc/mocha-typescript)
[![Appveyor Build Status](https://img.shields.io/appveyor/ci/silkentrance/mocha-typescript.svg)](https://ci.appveyor.com/project/silkentrance/mocha-typescript)
![Apache 2.0 License](https://img.shields.io/npm/l/mocha-typescript.svg)

## Extending Test Behavior

### Accessing the Mocha Context Within Class Methods
There are various aspects of the suites and tests that can be altered via the mocha context.
Within the default mocha 'BDD' style this is done through the callback's `this` object.
That object is exposed to the TypeScript decorators based UI through a field decorated with the `@context` decorator:
```TypeScript
@suite class MyClass {
  @context mocha; // Set for instance methods such as tests and before/after
  static @context mocha; // Set for static methods such as static before/after (mocha bdd beforeEach/afterEach)
  after() {
    this.mocha.currentTest.state;
  }
}
```

### Skipping Tests In Suite After First Failure - skipOnError
In functional testing it is sometimes fine to skip the rest of the suite when one of the tests fail.
Consider the case of a web site tests where the login test fail and subsequent tests that depend on the login will hardly pass.
This can be done with the `skipOnError` suite trait:
```TypeScript
@suite(skipOnError)
class StockSequence {
    @test step1() {}
    @test step2() { throw new Error("Failed"); }
    @test step3() { /* will be skipped */ }
    @test step4() { /* will be skipped */ }
}
```
