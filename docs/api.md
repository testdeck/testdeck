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

- [Declarative Interface](#declarative-interface)
  - [suite Function](#suite-function)
  - [suite.only Function](#suite.only-function)
  - [suite.skip Function](#suite.skip-function)
  - [test Function](#test-function)
  - [test,only Function](#test.only-function)
  - [test.skip Function](#test.skip-function)
  - [retries Function](#retries-function)
  - [slow Function](#slow-function)
  - [timeout Function](#timeout-function)
- [Object Oriented Interface](#object-oriented-interface)
  - [@suite Decorator](#@suite-decorator)
  - [@suite.only Decorator](#@suiteonly-decorator)
  - [@suite.skip Decorator](#@suiteskip-decorator)
  - [@test Decorator](#@test-decorator)
  - [@test.only Decorator](#@testonly-decorator)
  - [@test.skip Decorator](#@testskip-decorator)
  - [@params Decorator](#@params-decorator)
  - [@params.naming Decorator](#@paramsnaming-decorator)
  - [@params.only Decorator](#@paramsonly-decorator)
  - [@params.skip Decorator](#@paramsskip-decorator)
  - [@retries Decorator](#@retries-decorator)
  - [@slow Decorator](#@slow-decorator)
  - [@timeout Decorator](#@timeout-decorator)
  - [Traits](#traits)
    - [retries](#retries-trait)
    - [slow](#slow-trait)
    - [timeout](#timeout-trait)

### Declarative Interface

The declarative interface tries to match the original Mocha API as close as possible.

#### suite Function

The `suite` function is an alias for `describe` and `context` and is part of the declarative interface.

Using `suite`, you declare test suites, just like you are accustomed to with Mocha.

And, just as in Mocha, you can declare nested test suites or generate test suites on the fly.

We recommend using `suite` only as this will give you a more easy transition to the 
[Object Oriented Interface](#object-oriented-interface).

##### Synopsis

```TypeScript
declare function suite(title: string, fn: (this: Mocha.Suite) => void): Mocha.Suite;
declare function describe(title: string, fn: (this: Mocha.Suite) => void): Mocha.Suite;
declare function context(title: string, fn: (this: Mocha.Suite) => void): Mocha.Suite;
```

##### Example Usage

```TypeScript
import { suite } from "mocha-typescript";

suite("Suite", () => {
  
  // ...
});
```

***IMPORTANT*** Please note that `describe` and `context` are global and cannot be imported from `mocha-typescript`.

#### suite.only Function

The `suite.only` function is an alias for `describe.only` and is part of the declarative interface.

Using `suite.only` TBD

##### Synopsis

```TypeScript
namespace describe {

  declare function only(title: string, fn: (this: Mocha.Suite) => void): Mocha.ExclusiveSuiteFunction;
}

namespace suite {
  
  declare function only(title: string, fn: (this: Mocha.Suite) => void): Mocha.ExclusiveSuiteFunction;
}
```

***IMPORTANT*** Please note that `describe` is global and cannot be imported from `mocha-typescript`.

##### Example Usage

```TypeScript
import { suite } from "mocha-typescript";

suite.only("Suite", () => {
  
  // ...
});
```

***CAVEAT*** Your IDE may not recognise this as a valid test suite.

#### suite.skip Function

The `suite.skip` function is an alias for `suite.pending` and is part of the declarative interface.

Additional aliases for this are `xdescribe`, `xcontext`, and `describe.skip`.

Using `suite.skip` TBD

##### Synopsis

```TypeScript
declare function xdescribe(title: string, fn: (this: Mocha.Suite) => void): Mocha.PendingSuiteFunction;
declare function xcontext(title: string, fn: (this: Mocha.Suite) => void): Mocha.PendingSuiteFunction;

namespace describe {

  declare function skip(title: string, fn: (this: Mocha.Suite) => void): Mocha.PendingSuiteFunction;
}

namespace suite {
  
  declare function skip(title: string, fn: (this: Mocha.Suite) => void): Mocha.PendingSuiteFunction;
  declare function pending(title: string, fn: (this: Mocha.Suite) => void): Mocha.PendingSuiteFunction;
}
```

##### Example Usage

```TypeScript
import { suite } from "mocha-typescript";

suite.skip("Suite", () => {
  
  // ...
});
```

***CAVEAT*** Your IDE may not recognise this as a valid test suite. 

***IMPORTANT*** Please note that `xdescribe` and `xcontext` are global and cannot be imported from `mocha-typescript`.

#### test Function

The `test` function is an alias for `it` and `specify` and is part of the declarative interface.

Using `test`, you declare tests within test suites, just like you are accustomed to with Mocha.

And, just as in Mocha, you can generate tests on the fly.

We recommend using `test` only as this will give you a more easy transition to the 
[Object Oriented Interface](#object-oriented-interface).

##### Synopsis

```TypeScript
declare function specify(name: string, callable: Mocha.Func): void;
declare function specify(name: string, callable: Mocha.AsyncFunc): void;
declare function it(name: string, callable: Mocha.Func): void;
declare function it(name: string, callable: Mocha.AsyncFunc): void;
declare function test(name: string, callable: Mocha.Func): void;
declare function test(name: string, callable: Mocha.AsyncFunc): void;
```

***IMPORTANT*** Please note that `it` and `specify` are global and cannot be imported from `mocha-typescript`.

##### Example Usage

```TypeScript
import { suite, test } from "mocha-typescript";

suite("Suite", () => {
  
  test("Test", () => {
    
    // ...
  });
  
  // ...
});
```

#### test.only Function

The `test.only` function is an alias for `it.only` and is part of the declarative interface.

Using `test.only` TBD

##### Synopsis

```TypeScript
namespace it {
  
  declare function only(name: string, callable: () => void): Mocha.Test;
}

namespace test {
  
  declare function only(name: string, callable: () => void): void;
}
```

***IMPORTANT*** Please note that `it` is global and cannot be imported from `mocha-typescript`.

##### Example Usage

```TypeScript
import { suite, test } from "mocha-typescript";

suite("Suite", () => {
  
  test.only("Test", () => {
    
    // ...
  });

  // ...
});
```

***CAVEAT*** Your IDE may not recognise this as a valid test.

#### test.skip Function

The `test.skip` function is an alias for `test.pending` and is part of the declarative interface.

Additional aliases for this are `xit`, `xspecify`, and `it.skip`. 

Using `test.skip` TBD

##### Synopsis

```TypeScript
declare function xit(name: string, callable: () => void): Mocha.PendingTestFunction;
declare function xspecify(name: string, callable: () => void): Mocha.PendingTestFunction;

namespace it {
  
  declare function skip(name: string, callable: () => void): void;  
}

namespace test {
  
  declare function skip(name: string, callable: () => void): void;
  declare function pending(name: string, callable: () => void): void;
}
```

***IMPORTANT*** Please note that `xit`, `xspecify` and `it` are global and cannot be imported from `mocha-typescript`.

##### Example Usage

```TypeScript
import { suite, test } from "mocha-typescript";

suite("Suite", () => {
  
  test.skip("Test", () => {
    
    // ...
  });

  // ...
});
```

***CAVEAT*** Your IDE may not recognise this as a valid test.

#### retries Function

TBD retries function.

##### Synopsis

```TypeScript
declare function retries(times: number): void;
```

##### Example Usage

```TypeScript
import { suite, test } from "mocha-typescript";

suite("Suite", () => {
  
  this.retries(5);
  
  test("Test", () => {
    
    this.retries(5);
    
    // ...
  });

  // ...
});
```

#### slow Function

TBD slow function.

##### Synopsis

```TypeScript
declare function slow(timeInSeconds: number): void;
```

##### Example Usage

```TypeScript
import { suite, test } from "mocha-typescript";

suite("Suite", () => {
  
  this.slow(5);
  
  test("Test", () => {
    
    this.slow(5);
    
    // ...
  });

  // ...
});
```

#### timeout Function

TBD timeout function.

##### Synopsis

```TypeScript
declare function timeout(timeInSeconds: number): void;
```

##### Example Usage

```TypeScript
import { suite, test } from "mocha-typescript";

suite("Suite", () => {

  this.timeout(5);
  
  test("Test", () => {
    
    this.timeout(5);
    
    // ...
  });

  // ...
});
```

### Object Oriented Interface

#### @suite Decorator

The `@suite` decorator is part of the object oriented interface.

##### Synopsis

```TypeScript
declare function suite(name?: String, ... traits: SuiteTrait); 
```

##### Example Usage

#### @suite.only Decorator

The `@suite.only` decorator is part of the object oriented interface.

##### Synopsis

```TypeScript
declare function suite.only(name: string, ... traits: SuiteTrait): void;
```

##### Example Usage

#### @test Decorator

The `@test` decorator is part of the object oriented interface.

##### Synopsis

```TypeScript
import { suite, test } from "mocha-typescript";

@suite
class Suite {
  
  @test[([name][, timeout][, slow][, retries])]
  public testMethod() {}
}
```

##### Example Usage

#### @test.only Decorator

The `@test.only` decorator is part of the object oriented interface.

##### Synopsis

```TypeScript
import { suite, test } from "mocha-typescript";

@suite
class Suite {
  
  @test.only[([name][, timeout][, slow][, retries])]
  public testMethod() {}
}
```

#### @test.skip Decorator

The `@test.skip` decorator is part of the object oriented interface.

##### Synopsis

```TypeScript
import { suite, test } from "mocha-typescript";

@suite
class Suite {
  
  @test.skip[([name][, timeout][, slow][, retries])]
  public testMethod() {}
}
```

##### Example Usage

#### @params Decorator

##### Synopsis

##### Example Usage

#### @params.naming Decorator

##### Synopsis

##### Example Usage

#### @params.only Decorator

##### Synopsis

##### Example Usage

#### @params.skip Decorator

##### Synopsis

##### Example Usage

#### @retries Decorator

##### Synopsis

#### @slow Decorator

##### Synopsis

#### @timeout Decorator

##### Synopsis

### Traits

#### retries Trait

##### Synopsis

##### Example Usage

#### slow Trait

##### Synopsis

##### Example Usage

#### timeout Trait

##### Synopsis

##### Example Usage
