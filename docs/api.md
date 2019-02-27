# mocha-typescript

[![Get it on NPM](https://img.shields.io/npm/v/mocha-typescript.svg)](https://www.npmjs.com/package/mocha-typescript)
[![Downloads per Week](https://img.shields.io/npm/dw/mocha-typescript.svg)](https://www.npmjs.com/package/mocha-typescript)
[![Dependencies](https://img.shields.io/librariesio/github/pana-cc/mocha-typescript.svg)](https://libraries.io/npm/mocha-typescript)
[![Issues](https://img.shields.io/github/issues/pana-cc/mocha-typescript.svg)](https://github.com/pana-cc/mocha-typescript/issues)
[![Pull Requests](https://img.shields.io/github/issues-pr/pana-cc/mocha-typescript.svg)](https://github.com/pana-cc/mocha-typescript/pulls)
[![Travis Build Status](https://img.shields.io/travis/pana-cc/mocha-typescript/master.svg)](https://travis-ci.org/pana-cc/mocha-typescript)
[![Appveyor Build Status](https://img.shields.io/appveyor/ci/pana-cc/mocha-typescript.svg)](https://ci.appveyor.com/project/pana-cc/mocha-typescript)
![Apache 2.0 License](https://img.shields.io/npm/l/mocha-typescript.svg)

## API

- [@suite Decorator](#@suite-decorator)
- [@suite.only Decorator](#@suiteonly-decorator)
- [@suite.pending Decorator](#@suitepending-decorator)
- [@suite.skip Decorator](#@suiteskip-decorator)
- [@test Decorator](#@test-decorator)
- [@test.only Decorator](#@testonly-decorator)
- [@test.skip Decorator](#@testskip-decorator)
- [@test.pending Decorator](#@testpending-decorator)
- [@params Decorator](#@params-decorator)
- [@params.naming Decorator](#@paramsnaming-decorator)
- [@params.only Decorator](#@paramsonly-decorator)
- [@params.skip Decorator](#@paramsskip-decorator)
- [@only Decorator](#@only-decorator)
- [@pending Decorator](#@pending-decorator)
- [@retries Decorator](#@retries-decorator)
- [@skip Decorator](#@skip-decorator)
- [@slow Decorator](#@slow-decorator)
- [@timeout Decorator](#@timeout-decorator)
- [Traits](#traits)
  - [retries](#retries-trait)
  - [slow](#slow-trait)
  - [timeout](#timeout-trait)
  - [skipOnError](#skiponerror-trait)


### @suite Decorator

The `@suite` decorator is used for declaring test suites from classes.

The decorator can be used in multiple different ways.

#### Example Usages

```typescript
import { suite, timeout, retries, slow, skipOnError } from "mocha-typescript";

@suite
class Suite {
}

@suite("my-suite")
class NamedSuite {
}

@suite(timeout(10000), slow(5000), retries(5), skipOnError)
class SuiteWithTraits {
}

@suite("my-suite", timeout(10000), slow(5000), retries(5))
class NamedSuiteWithTraits {
}
```

### @suite.only Decorator

The `@suite.only` decorator is a specialisation of the `@suite` decorator. It supports the same set of parameters.

Decorating a class with this will ensure that only this suite, and all other suites that have been decorated by this, 
will be run.

The same behaviour can be achieved by decorating your suite using the `@only` decorator.

#### Example Usages

```typescript
import { suite, only } from "mocha-typescript";

@suite.only
class OnlySuite {
}

@suite.only("my-only-suite")
class NamedOnlySuite {
}

@suite("my-alt-only-suite")
@only
class AltOnlySuite {
}
```

### @suite.pending Decorator

This is an alias for `@suite.skip`.

#### Example Usages

```typescript
import { suite, pending } from "mocha-typescript";

@suite.pending
class SkippedSuite {
}

@suite.pending("my-pending-suite")
class NamedPendingSuite {
}

@suite("my-alt-pending-suite")
@pending
class AltPendingSuite {
}
```

### @suite.skip Decorator

The `@suite.skip` decorator is a specialisation of the `@suite` decorator. It supports the same set of parameters.

Decorating a class with this will ensure that this suite, and all other suites that have been decorated by this, will 
be skipped.

The same behaviour can be achieved by decorating your suite using the `@skip` decorator.

#### Example Usages

```typescript
import { suite, skip } from "mocha-typescript";

@suite.skip
class SkippedSuite {
}

@suite.skip("my-skipped-suite")
class NamedSkippedSuite {
}

@suite("my-alt-skip-suite")
@skip
class AltSkippedSuite {
}
```

### @test Decorator

The `@test` decorator is used to declare individual methods of your suite class as tests.

The decorator can be used in multiple different ways.

#### Example Usages

```typescript
import { suite, test, timeout, slow, retries } from "mocha-typescript";

@suite
class Suite {
  
  @test
  testMethod() {}
  
  @test("named-test")
  namedTest() {}
  
  @test("named-test-with-traits", timeout(10000), slow(5000), retries(2))
  namedTestWithTraits() {}

  @test(timeout(10000), slow(5000), retries(2))
  testWithTraits() {}
}
```

### @test.only Decorator

The `@test.only` decorator is a specialisation of the `@test` decorator. It supports the same set of parameters.

Decorating a method with this will ensure that only this method, and all other methods that have been decorated by this,
will be run.

The same behaviour can be achieved by decorating your method using the `@only` decorator.

#### Example Usages

```typescript
import { suite, test, only } from "mocha-typescript";

@suite
class Suite {
  
  @test.only
  onlyTest() {}

  @test.only("named-only-test")
  namedOnlyTest() {}

  @test
  @only
  altOnlyTest() {}
}
```

### @test.pending Decorator

This is an alias for `@test.skip`. See also the `@pending` decorator.

#### Example Usages

```typescript
import { suite, test, pending } from "mocha-typescript";

@suite
class Suite {
  
  @test.pending
  pendingTest() {}

  @test.skip("named-pending-test")
  namedPendingTest() {}

  @test
  @pending
  altPendingTest() {}
}
```

### @test.skip Decorator

The `@test.skip` decorator is a specialisation of the `@test` decorator. It supports the same set of parameters.

Decorating a method with this will ensure that this method, and all other methods that have been decorated by this,
will be skipped.

The same behaviour can be achieved by decorating your method using the `@skip` decorator.

#### Example Usages

```typescript
import { suite, test, skip } from "mocha-typescript";

@suite
class Suite {
  
  @test.skip
  skipTest() {}

  @test.skip("named-skip-test")
  namedSkipTest() {}

  @test
  @skip
  altSkipTest() {}
}
```

### @params Decorator

The decorator allows you to parametrise your tests. Under the hood, it behaves similarly to the `@test` decorator, so
you do not have to also decorate your test methods with the extra decorator.

The decorator can be used in multiple different ways and it can be used multiple times, too.

Please note, that you cannot pass any traits to the decorator. Instead, you have to use the existing decorator
alternatives, such as `@timeout`, `@slow` or `@retries`.

#### Example Usages

```typescript
import { suite, params, timeout } from "mocha-typescript";

@suite
class Suite {
  
  @params({ arg1: "arg1", arg2: "arg2" })
  @params({ arg1: "arg1.1", arg2: "arg2.1" })
  parametrisedTest({ arg1, arg2 }) {}

  @params({ arg1: "arg1", arg2: "arg2" }, "named-parametrised-test.1")
  @params({ arg1: "arg1.1", arg2: "arg2.1" }, "named-parametrised-test.2")
  @timeout(50000)
  namedParametrisedTest({ arg1, arg2 }) {}
}
```

### @params.naming Decorator

The decorator allows you to override the standard naming strategy for parametrised tests by passing in a function that
will return the actual name based on the parameters that currently being tested.

#### Example Usages

```typescript
import { suite, params } from "mocha-typescript";

@suite
class Suite {
  
  @params({ arg1: "arg1", arg2: "arg2" })
  @params({ arg1: "arg1.1", arg2: "arg2.1" }, "overriding-the-custom-naming-strategy-here")
  @params.naming(args => `testing_${args.arg1}_${args.arg2}`)
  customNamedParametrisedTest({ arg1, arg2 }) {}
}
```

### @params.only Decorator

The `@params.only` decorator is a specialisation of the `@params` decorator. It supports the same set of parameters.

Decorating a method with this will ensure that only this set of parameters, and all sets of parameters that have been
decorated by this, will be run.

Please note that this will also affect the other tests in the same suite, which will not be run unless they have been
decorated by one of the available `only` decorators.

#### Example Usages

```typescript
import { suite, params } from "mocha-typescript";

@suite
class Suite {
  
  @params.only({ arg1: "arg1", arg2: "arg2" })
  @params({ arg1: "arg1.1", arg2: "arg2.1" }, "overriding-the-custom-naming-strategy-here")
  @params.naming(args => `testing_${args.arg1}_${args.arg2}`)
  onlyCustomNamedParametrisedTest({ arg1, arg2 }) {}
}
```

### @params.pending Decorator

This is an alias for `@params.skip`.

#### Example Usages

```typescript
import { suite, params } from "mocha-typescript";

@suite
class Suite {
  
  @params.pending({ arg1: "arg1", arg2: "arg2" })
  @params({ arg1: "arg1.1", arg2: "arg2.1" }, "overriding-the-custom-naming-strategy-here")
  @params.naming(args => `testing_${args.arg1}_${args.arg2}`)
  customNamedParametrisedTest({ arg1, arg2 }) {}
}
```

### @params.skip Decorator

The `@params.skip` decorator is a specialisation of the `@params` decorator. It supports the same set of parameters.

Decorating a method with this will ensure that this set of parameters, and all other sets of parameters that have been
decorated by this, will be skipped.

#### Example Usages

```typescript
import { suite, params } from "mocha-typescript";

@suite
class Suite {
  
  @params.skip({ arg1: "arg1", arg2: "arg2" })
  @params({ arg1: "arg1.1", arg2: "arg2.1" }, "overriding-the-custom-naming-strategy-here")
  @params.naming(args => `testing_${args.arg1}_${args.arg2}`)
  customNamedParametrisedTest({ arg1, arg2 }) {}
}
```

### @retries Decorator

The decorator can be used as an alternative for the `retries` trait.

It can be used as a test method decorator.

#### Example Usages

```typescript
import { suite, test, retries } from "mocha-typescript";

@suite
class SuiteWithRetries {
  
  @test
  @retries(5)
  retriesTest() {}
}
```

### @only Decorator

The decorator can be used as an alternative for both `@suite.only` and `@test.only`.

It can be used as both a suite class decorator as well as a test method decorator.

#### Example Usages

```typescript
import { suite, test, only } from "mocha-typescript";

@suite
@only
class OnlySuite {}

@suite
class OnlyTestSuite {
  
  @test
  @only
  onlyTest() {}
}
```

### @pending Decorator

The decorator is an alias for `@skip`.

It can be used as both a suite class decorator as well as a test method decorator.

### Example Usages

```typescript
import { suite, test, pending } from "mocha-typescript";

@suite
@pending
class PendingSuite {}

@suite
class PendingTestSuite {
  
  @test
  @pending
  pendingTest() {}
}
```

### @skip Decorator

The decorator can be used as an alternative for both `@suite.skip` and `@test.skip`.

It can be used as both a suite class decorator as well as a test method decorator.

#### Example Usages

```typescript
import { suite, test, skip } from "mocha-typescript";

@suite
@skip
class SkippedSuite {}

@suite
class SkippedTestSuite {
  
  @test
  @skip
  skippedTest() {}
}
```

### @slow Decorator

The decorator can be used as an alternative for the `slow` trait.

It can be used as both a suite class decorator as well as a test method decorator.

#### Example Usages

```typescript
import { suite, test, slow } from "mocha-typescript";

@suite
@slow(1000) // default timeout is 2000
class SuiteWithTimeout {
  
  @test
  test() {}
}

@suite
class SuiteWithTestTimeout {
  
  @test
  @slow(1000) // default timeout is 2000
  slowTest() {}
}
```

### @timeout Decorator

The decorator can be used as an alternative for the `timeout` trait.

It can be used as both a suite class decorator as well as a test method decorator.

#### Example Usages

```typescript
import { suite, test, timeout } from "mocha-typescript";

@suite
@timeout(20000)
class SuiteWithTimeout {
  
  @test
  test() {}
}

@suite
class SuiteWithTestTimeout {
  
  @test
  @timeout(20000)
  timeoutTest() {}
}
```

### Traits

Traits can be passed in as parameters to either `@suite` or `@test`. Alternatively, for most traits, there also exists
a decorator that can be used instead.

### retries Trait

TBD: test trait only

#### Example Usage

```typescript
import { suite, test, retries } from "mocha-typescript";

@suite
class Suite {
  
  @test(retries(5))
  retriedTest() {}
}
```

### slow Trait

TBD: both suite and test trait

#### Example Usage

```typescript
import { suite, test, slow } from "mocha-typescript";

@suite(slow(5000))
class SlowSuite {
  
  @test(slow(3000))
  slowTest() {}
}
```

### timeout Trait

TBD: both suite and test trait

#### Example Usage

```typescript
import { suite, test, timeout } from "mocha-typescript";

@suite(timeout(10000))
class TimeoutSuite {
  
  @test(timeout(5000))
  timeoutTest() {}
}
```

### skipOnError Trait

TBD: suite trait only

#### Example Usage

```typescript
import { suite, test, skipOnError } from "mocha-typescript";

@suite(skipOnError)
class TimeoutSuite {
  
  @test
  failingTest() { assert.fail("failing, everything else will be skipped"); }

  @test
  skippedTest() {}
}
```
