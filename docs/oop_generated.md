# mocha-typescript

[![Get it on NPM](https://img.shields.io/npm/v/mocha-typescript.svg)](https://www.npmjs.com/package/mocha-typescript)
[![Downloads per Week](https://img.shields.io/npm/dw/mocha-typescript.svg)](https://www.npmjs.com/package/mocha-typescript)
[![Dependencies](https://img.shields.io/librariesio/github/pana-cc/mocha-typescript.svg)](https://libraries.io/npm/mocha-typescript)
[![Issues](https://img.shields.io/github/issues/pana-cc/mocha-typescript.svg)](https://github.com/pana-cc/mocha-typescript/issues)
[![Pull Requests](https://img.shields.io/github/issues-pr/pana-cc/mocha-typescript.svg)](https://github.com/pana-cc/mocha-typescript/pulls)
[![Travis Build Status](https://img.shields.io/travis/pana-cc/mocha-typescript/master.svg)](https://travis-ci.org/pana-cc/mocha-typescript)
[![Appveyor Build Status](https://img.shields.io/appveyor/ci/silkentrance/mocha-typescript.svg)](https://ci.appveyor.com/project/silkentrance/mocha-typescript)
![Apache 2.0 License](https://img.shields.io/npm/l/mocha-typescript.svg)

## Generated Suites and Tests

With Mocha and also with mocha-typescript, you are able to generate tests on the fly. Generating tests, both suites and
test methods, is basically all about parameterising a defined suite of tests that are being run against a given SUT, or
system under test.

### Primer

First, you should have a look at the official mocha documentation on that topic 

- [dynamically generated tests](https://mochajs.org/#dynamically-generating-tests) (1)

Next, you might want to for example look at the following projects (you are welcome to supply us with more examples)

- [pingo-common](https://github.com/coldrye-es/pingo-common/blob/master/test/guards-test.es) (2) (*)
- [ypo-lexer-i18next](https://github.com/coldrye-es/ypo-lexer-i18next/blob/master/test/lexer-test.es) (3) (*)

Looking at the above, you might detect a pattern here. While (3) also generates suites on the fly, everything basically
boils down to parameterisation of the tests that are being run from a defined set of parameters aka test cases.

(*) The above projects (2) and (3) have been discontinued and are no longer under active development, so do not use 
them. They are provided for reference only as the code is rather clear to read and you should get a fine understanding 
on how dynamic test generation works with Mocha.

#### More Advanced Examples

- [node-tmp](https://github.com/raszi/node-tmp/tree/master/test) Standard Mocha Tests
- [mocha-typescript](https://github.com/pana-cc/mocha-typescript/tree/master/test) Object-oriented Tests

### Standard BDD/TDD Interface

We will not discuss this any further as there is plenty of documentation already, see [Primer](#primer) above.

### Object Oriented Interface

With the new object oriented interface introduced by `mocha-typescript`, you can now use [@params](oop_params.md)
to parameterise your test methods.

#### Limitations

With TypeScript, however, dynamic generation of test suites is somewhat limited in that you are not able to template
your suite classes any further as in the below example

```TypeScript
import { suite, test } from "mocha-typescript";

[{ title: 'google', url: 'www.google.com' },
 { title: 'github', url: 'www.github.com' }
].forEach(({title, url}) => {
    @suite(`Http ${title}`) class GeneratedTestClass {
        @test login() {}
        @test logout() {}
    }
});
``` 

And, based on the way that `mocha-typescript` works, once that the class has been defined, you cannot dynamically add 
any more test methods to the class.

#### Mixins FTW!
TypeScript provides you with a mechanism which is called [Mixin](https://www.typescriptlang.org/docs/handbook/mixins.html).
We can use that mechanism to our benefit, e.g.

```TypeScript
import { suite, test } from "mocha-typescript";

interface TestMixin {
  [key: string]: any;
}

abstract class AbstractMixinTestBase implements TestMixin {

  [key: string]: any;
}

class TestsMixin1 {

  @test test1() {}
}

class TestsMixin2 {

  @test test2() {}
}

// courtesy of https://www.typescriptlang.org/docs/handbook/mixins.html
function applyMixins(derivedCtor: any, baseCtors: any[]) {
  baseCtors.forEach(baseCtor => {
    Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
      derivedCtor.prototype[name] = baseCtor.prototype[name];
    });
  });
}

[
  { title: 'google', url: 'www.google.com', bases: [TestsMixin1] },
  { title: 'github', url: 'www.github.com', bases: [TestsMixin1, TestsMixin2] }
].forEach(({title, url, bases}) => {
  class GeneratedTestClass extends AbstractMixinTestBase {
    @test login() {}
    @test logout() {}
  }
  applyMixins(GeneratedTestClass, bases);
  suite(title)(GeneratedTestClass);
});

```

For starters, have a look at a [working example](https://github.com/pana-cc/mocha-typescript/blob/master/test/it/fixtures/generated.suite.ts).
See also [here for named suites](https://github.com/pana-cc/mocha-typescript/blob/master/test/it/fixtures/generated.named.suite.ts).

FUTURE: `mocha-typescript` will provide you with both the `TestMixin` interface, the abstract base class 
`AbstractMixinTestBase`, and the `applyMixins` function.

And maybe also a generic version of the above depicted parameterisation.
