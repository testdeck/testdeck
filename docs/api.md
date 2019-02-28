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

- [Terminology](#terminology)
- [Suites](#suites)
  - [@suite Decorator](#suite-decorator)
  - [@suite.only Decorator](#suiteonly-decorator)
  - [@suite.pending Decorator](#suitepending-decorator)
  - [@suite.skip Decorator](#suiteskip-decorator)
- [Tests](#tests)
  - [@test Decorator](#test-decorator)
  - [@test.only Decorator](#testonly-decorator)
  - [@test.skip Decorator](#testskip-decorator)
  - [@test.pending Decorator](#testpending-decorator)
- [Parametrised Tests](#parametrised-tests)
  - [@params Decorator](#params-decorator)
  - [@params.naming Decorator](#paramsnaming-decorator)
  - [@params.only Decorator](#paramsonly-decorator)
  - [@params.skip Decorator](#paramsskip-decorator)
  - [@params.pending Decorator](#paramspending-decorator)
- [Suite and Test Execution Modifiers](#suite-and-test-execution-modifiers)
  - [@only Decorator](#only-decorator)
  - [@pending Decorator](#pending-decorator)
  - [@skip Decorator](#skip-decorator)
- [Traits](#traits)
  - [retries](#retries-trait)
  - [@retries Decorator](#retries-decorator)
  - [slow](#slow-trait)
  - [@slow Decorator](#slow-decorator)
  - [timeout](#timeout-trait)
  - [@timeout Decorator](#timeout-decorator)
  - [skipOnError](#skiponerror-trait)
- [Miscellaneous](#miscellaneous)
  - [@context Decorator](#context-decorator)
  - [registerDI Function](#registerdi-function)


### Terminology

In `Mocha` we use `describe` to define a context for our test specifications.
In here, we refer to this as either a `suite` or a `suite class`.

Similarly so for the individual specifications or specs, commonly referred to in `Mocha` as `it`.
In here, we refer to these as either a `test` or a `test method`. 


### Suites

#### @suite Decorator

The `@suite` decorator is used for declaring test suites from classes.

The decorator can be used in multiple different ways.

##### Example Usages

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

#### @suite.only Decorator

The `@suite.only` decorator is a specialisation of the `@suite` decorator. It supports the same set of parameters.

Decorating a class with this will ensure that only this suite, and all other suites that have been decorated by this, 
will be run.

The same behaviour can be achieved by decorating your suite class by using the [@only](#only-decorator) decorator.

##### Example Usages

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

#### @suite.pending Decorator

This is an alias for the [@suite.skip](#suiteskip-decorator) decorator.

The same behaviour can be achieved by decorating your suite class by using the [@pending](#pending-decorator) decorator.

##### Example Usages

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

#### @suite.skip Decorator

The `@suite.skip` decorator is a specialisation of the `@suite` decorator. It supports the same set of parameters.

Decorating a suite class with this will ensure that this suite, and all other suites that have been decorated by this, 
will be skipped, including their declared tests.

The same behaviour can be achieved by decorating your suite class by using the [@skip](#skip-decorator) decorator.

##### Example Usages

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

### Tests

#### @test Decorator

The `@test` decorator is used to declare individual methods of your suite class as tests.

The decorator can be used in multiple different ways.

##### Example Usages

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

#### @test.only Decorator

The `@test.only` decorator is a specialisation of the `@test` decorator. It supports the same set of parameters.

Decorating a method with this will ensure that only this method, and all other methods that have been decorated by this,
will be run.

The same behaviour can be achieved by decorating your test method by using the [@only](#only-decorator) decorator.

##### Example Usages

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

#### @test.pending Decorator

This is an alias for the [@test.skip](#testskip-decorator) decorator.

The same behaviour can be achieved by decorating your test method by using the [@pending](#pending-decorator)
decorator.

##### Example Usages

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

#### @test.skip Decorator

The `@test.skip` decorator is a specialisation of the `@test` decorator. It supports the same set of parameters.

Decorating a method with this will ensure that this method, and all other methods that have been decorated by this,
will be skipped.

The same behaviour can be achieved by decorating your test method by using the [@skip](#skip-decorator) decorator.

##### Example Usages

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

### Parametrised Tests 

#### @params Decorator

The decorator allows you to parametrise your tests. Under the hood, it behaves similarly to the `@test` decorator.
While both should be working just fine in conjunction, you should not decorate your so parametrised test methods with
the `@test` decorator, too, as it is utterly redundant.

The decorator can be used in multiple different ways and it can be used multiple times, too.

Please note, that you cannot pass any traits to the decorator. Instead, you have to use the existing decorator
alternatives, i.e. [@retries](#retries-decorator), [@slow](#slow-decorator), and [@timeout](#timeout-decorator).

Please also note that you must not mix the existing [execution modifiers](#suite-and-test-execution-modifiers)
with the available `@params` decorators as the resulting behaviour is undefined.

##### Example Usages

```typescript
import { suite, params, timeout } from "mocha-typescript";

@suite
class Suite {
  
  @params({ arg1: "arg1", arg2: "arg2" })
  @params({ arg1: "arg1.1", arg2: "arg2.1" })
  parametrisedTest({ arg1, arg2 }) {}

  @params({ arg1: "arg1", arg2: "arg2" }, "overriding-the-standard-naming-strategy")
  @timeout(50000)
  customNamedParametrisedTest({ arg1, arg2 }) {}
}
```

#### @params.naming Decorator

The decorator allows you to override the standard naming strategy for parametrised tests by passing in a function that
will return the actual name. The function will be passed in the currently tested parameter set.

##### Example Usages

```typescript
import { suite, params } from "mocha-typescript";

@suite
class Suite {
  
  @params({ arg1: "arg1", arg2: "arg2" })
  @params({ arg1: "arg1.1", arg2: "arg2.1" }, "overriding-the-custom-naming-strategy-here")
  @params.naming(({ p1, p2 }) => `testing_${p1}_${p2}`)
  customNamedParametrisedTest({ p1, p2 }) {}
}
```

#### @params.only Decorator

The `@params.only` decorator is a specialisation of the `@params` decorator. It supports the same set of parameters.

Decorating a method with this will ensure that only this set of parameters, and all sets of parameters that have been
decorated by this, will be run.

Please note that this will also affect the other tests in the same suite, which will not be run unless they have been
decorated by one of the available `only` decorators, too.

##### Example Usages

```typescript
import { suite, params } from "mocha-typescript";

@suite
class Suite {
  
  @params.only({ arg1: "arg1", arg2: "arg2" })
  @params({ arg1: "arg1.1", arg2: "arg2.1" })
  onlyCustomNamedParametrisedTest({ arg1, arg2 }) {}
}
```

#### @params.pending Decorator

This is an alias for `@params.skip`.

##### Example Usages

```typescript
import { suite, params } from "mocha-typescript";

@suite
class Suite {
  
  @params.pending({ arg1: "arg1", arg2: "arg2" }, "overriding-the-custom-naming-strategy-here")
  @params({ arg1: "arg1.1", arg2: "arg2.1" })
  parametrisedTest({ arg1, arg2 }) {}
}
```

#### @params.skip Decorator

The `@params.skip` decorator is a specialisation of the `@params` decorator. It supports the same set of parameters.

Decorating a method with this will ensure that this set of parameters, and all other sets of parameters that have been
decorated by this, will be skipped.

##### Example Usages

```typescript
import { suite, params } from "mocha-typescript";

@suite
class Suite {
  
  @params.skip({ arg1: "arg1", arg2: "arg2" }, "overriding-the-custom-naming-strategy-here")
  @params({ arg1: "arg1.1", arg2: "arg2.1" })
  parametrisedTest({ arg1, arg2 }) {}
}
```

### Suite and Test Execution Modifiers

#### @only Decorator

The decorator can be used as an alternative for both `@suite.only` and `@test.only`.

It can be used as both a suite class decorator as well as a test method decorator.

##### Example Usages

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

#### @pending Decorator

The decorator is an alias for `@skip`.

It can be used as both a suite class decorator as well as a test method decorator.

##### Example Usages

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

#### @skip Decorator

The decorator can be used as an alternative for both `@suite.skip` and `@test.skip`.

It can be used as both a suite class decorator as well as a test method decorator.

##### Example Usages

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

### Traits

Traits can be passed in as parameters to either `@suite` or `@test`. For most traits, there also exists a decorator,
that you can use instead. The alternative decorators have been provided so that you can have both parametrised tests
using the `@params` decorator and still have control over these tests' timeouts, retries and so on.

#### retries Trait

The retries trait can be used on test methods only. It causes the test to be tried the specified number of times before
that it either succeeds or finally fails.

An alternative to this is the `retries` decorator, which you can find below.

##### Example Usage

```typescript
import { suite, test, retries } from "mocha-typescript";

@suite
class Suite {
  
  @test(retries(5))
  retriedTest() {}
}
```

#### @retries Decorator

The decorator can be used as an alternative for the `retries` trait.

It can be used as a test method decorator only.

##### Example Usages

```typescript
import { suite, test, retries } from "mocha-typescript";

@suite
class Suite {
  
  @test
  @retries(5)
  test() {}
}
```

#### slow Trait

The slow trait indicates to `Mocha` until after which time in milliseconds a given suite or test is considered to be 
running slow.

It can be used with both suites and tests. 

An alternative to this is the `slow` decorator, which you can find below.

##### Example Usage

```typescript
import { suite, test, slow } from "mocha-typescript";

@suite(slow(5000))
class SlowSuite {
  
  @test(slow(3000))
  slowTest() {}
}
```

#### @slow Decorator

The decorator can be used as an alternative for the `slow` trait.

It can be used as both a suite class decorator as well as a test method decorator.

##### Example Usages

```typescript
import { suite, test, slow } from "mocha-typescript";

@suite
@slow(1000)
class SlowSuite {
  
  @test
  test() {}
}

@suite
class SuiteWithSlowTest {
  
  @test
  @slow(1000)
  slowTest() {}
}
```

#### timeout Trait

The timeout trait indicates to `Mocha` to wait for an extra period of time in milliseconds before that a suite or test
is considered to be failing due to overall unresponsiveness or slowness.

Using this allows you to override the standard timeout, which by default is 2000ms.

The trait can be used with both suites and tests.

An alternative to this is the `timeout` decorator, which you can find below.

##### Example Usage

```typescript
import { suite, test, timeout } from "mocha-typescript";

@suite(timeout(10000))
class TimeoutSuite {
  
  @test(timeout(5000))
  timeoutTest() {}
}
```

#### @timeout Decorator

The decorator can be used as an alternative for the `timeout` trait.

It can be used as both a suite class decorator as well as a test method decorator.

##### Example Usages

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

#### skipOnError Trait

The skipOnError trait can be used with suites only. It will cause all subsequent tests to be skipped as soon as a
single test of that suite has failed.

##### Example Usage

```typescript
import { suite, test, skipOnError } from "mocha-typescript";
import * as assert from "assert";

@suite(skipOnError)
class TimeoutSuite {
  
  @test
  failingTest() { assert.fail("failing, everything else will be skipped"); }

  @test
  skippedTest() {}
}
```

### Miscellaneous

#### @context Decorator

The decorator can be applied onto both static properties and instance properties of a suite class.

When used, this will inject the current mocha context into the so decorated property.

##### Example Usage

```typescript
import { suite, context } from "mocha-typescript";

@suite
class Suite {
  
  @context
  mocha: mocha.Context;
  
  @context
  static mocha: mocha.Context;
}
```

#### registerDI Function

The registerDI function is provided to register dependency injection handlers with mocha-typescript.

Please note that the support for IOC is currently under review and that the currently implemented solution is far from
being perfect. Any feedback from you is highly appreciated!

##### Example Usage

```typescript
import "reflect-metadata";
import { registerDI } from "mocha-typescript";
import { Container } from "typedi";

registerDI({
  handles: (cls) => true,
  create: (cls) => Container.get(cls)
})
```
