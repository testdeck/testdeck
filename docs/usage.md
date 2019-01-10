# mocha-typescript

[![Get it on NPM](https://img.shields.io/npm/v/mocha-typescript.svg)](https://www.npmjs.com/package/mocha-typescript)
[![Downloads per Week](https://img.shields.io/npm/dw/mocha-typescript.svg)](https://www.npmjs.com/package/mocha-typescript)
[![Dependencies](https://img.shields.io/librariesio/github/pana-cc/mocha-typescript.svg)](https://libraries.io/npm/mocha-typescript)
[![Issues](https://img.shields.io/github/issues/pana-cc/mocha-typescript.svg)](https://github.com/pana-cc/mocha-typescript/issues)
[![Pull Requests](https://img.shields.io/github/issues-pr/pana-cc/mocha-typescript.svg)](https://github.com/pana-cc/mocha-typescript/pulls)
[![Travis Build Status](https://img.shields.io/travis/pana-cc/mocha-typescript/master.svg)](https://travis-ci.org/pana-cc/mocha-typescript)
[![Appveyor Build Status](https://img.shields.io/appveyor/ci/pana-cc/mocha-typescript.svg)](https://ci.appveyor.com/project/pana-cc/mocha-typescript)
![Apache 2.0 License](https://img.shields.io/npm/l/mocha-typescript.svg)

## Usage

### Before and After Actions
By default, before and after test actions are implemented with instance and static before and after methods.
The static before and after methods are invoked before the suite and after the suite,
the instance before and after methods are invoked before and after each test method.
```TypeScript
@suite class Suite {
    static before() { /* 1 */ }
    before() { /* 2, 5 */ }
    @test one() { /* 3 */ }
    @test one() { /* 6 */ }
    after() { /* 4, 7 */ }
    static after() { /* 8 */ }
}
```

### Async Tests, Before and After Actions
The methods that accept a `done` callback or return a `Promise` are considered async similar and their execution is similar to the one in mocha.
 - For `done`, calling it without params marks the test as passed, calling it with arguments fails the test.
 - For returned `Promise`, the test passes is the promise is resolved, the test fails if the promise is rejected.
```TypeScript
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

### Skipped and Only Suite and Tests
Marking a test as pending or marking it as the only one to execute declaratively is done using `@suite.skip`, `@suite.only`, `@test.skip` or `@test.only` similar to the mocha interfaces:
```TypeScript
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

To prevent `only` leaking to your production code you can use [tslint-mocha-typescript-no-only](https://www.npmjs.com/package/tslint-mocha-typescript-no-only) [tslint](https://palantir.github.io/tslint/) rule.

### Timing - Timeout, Slow
Controlling the time limits, similar to the `it("test", function() { this.slow(ms); /* ... */ });` is done using suite or test traits,
these are modifiers passed as arguments to the `@suite()` and `@test()` decorators:
```TypeScript
@suite(slow(1000), timeout(2000))
class Suite {
    @test first() {}
    @test(slow(2000), timeout(4000)) second() {}
}
```
The `slow` and `timeout` traits were initially working as decorators (e.g. `@suite @timeout(200) class Test {}`),
but this behavior may be dropped in future major versions as it generates too much decorators that clutter the syntax.
They are still useful though for setting timeouts on before and after methods (e.g. `@suite class Test { @timeout(100) before() { /* ... */ }}`).

### Retries
While it is definitely not a good practice to retry failing tests multiple times, sometimes one might not get around it.
```TypeScript
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
The retries can also be used as a decorator similar to `timeout` and `slow`, e.g. `@test @retries(3) testMethod() {}`.
