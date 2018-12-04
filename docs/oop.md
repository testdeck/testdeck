# mocha-typescript

[![Get it on NPM](https://img.shields.io/npm/v/mocha-typescript.svg)](https://www.npmjs.com/package/mocha-typescript)
[![Downloads per Week](https://img.shields.io/npm/dw/mocha-typescript.svg)](https://www.npmjs.com/package/mocha-typescript)
[![Dependencies](https://img.shields.io/librariesio/github/pana-cc/mocha-typescript.svg)](https://libraries.io/npm/mocha-typescript)
[![Issues](https://img.shields.io/github/issues/pana-cc/mocha-typescript.svg)](https://github.com/pana-cc/mocha-typescript/issues)
[![Pull Requests](https://img.shields.io/github/issues-pr/pana-cc/mocha-typescript.svg)](https://github.com/pana-cc/mocha-typescript/pulls)
[![Build Status](https://img.shields.io/travis/pana-cc/mocha-typescript/master.svg)](https://travis-ci.org/pana-cc/mocha-typescript)
![Apache 2.0 License](https://img.shields.io/npm/l/mocha-typescript.svg)

## Object oriented testing

One can declare abstract classes as bases for derived test classes. Tests methods declared in these base classes will 
be run in the context of the concrete test class, namely the one that has been decorated with the `@suite` decorator.

```TypeScript
import { suite, test } from "mocha-typescript";

export abstract class AbstractTestBase {

  public static before() {
    // ...
  }

  public before() {
    // ...
  }

  @test aTestFromBase() {
    // ...
  }

  @test "another test from base"() {
    // ...
  }

  public after () {
    // ...
  }

  public static after () {
    // ...
  }
}

@suite class ConcreteTest extends AbstractTestBase {

  public static before() {
    // AbstractTestBase.before();
    // ...
  }

  public before() {
    // super.before();
    // ...
  }

  @test aTestFromConcrete() {
    // ...
  }

  public after() {
    // ...
    // super.after();
  }

  public static after() {
    // ...
    // AbstractTestBase.after();
  }
}
```

Note: You can override test methods inherited from a base class and then call `super()` in order to run the assertions 
implemented by the super class.

Best practice: You must not inherit from other classes that have been decorated with the ``suite`` decorator. Doing so 
will result in an exception. Use abstract base classes instead.

### Overriding Tests

Sometimes you might want to override tests inherited from a given base class. You can do this by declaring the same
test method in your sub class, e.g.

```TypeScript
import { assert } from "chai";
import { suite, test } from "mocha-typescript";

export abstract class AbstractTestBase {

  @test
  'test that will be overridden by sub classes'() {

    assert.fail('sub classes must override this');
  }
}

@suite
export class ConcreteTest extends AbstractTestBase {

  @test
  'test that will be overridden by sub classes'() {

    assert.isTrue(somethingTruthful);
  }
}
```

You may now either implement the test or simply just skip it.

Given that ``skip`` actually marks the test as pending, this might not be what you want for your test reports. In that
case, you could just override the test with an empty body.

Which, of course, is considered to be a bad practice, yet sometimes it will become a necessity when testing class
hierarchies. So the best practice is to actually provide an assertion for that test.

### Inheritance and Both Synchronous and Asynchronous Before and After Actions

As for both static and instance `before()` and `after()` actions, one must make sure that the hooks from the parent 
class are called, see the above example on how.

When using asynchronous actions, additional care must be taken, since one cannot simply pass the `done` callback to the 
parent classes' hooks and you will have to use something along the line of this in order to make it happen:

```TypeScript
import { suite } from "mocha-typescript";

export abstract class AbstractTestBase {

  public static before(done) {
    // ...
    // done([err]);
  }

  public before(done) {
    // ...
    // done([err]);
  }
}

@suite
class ConcreteTest extends AbstractTestBase {

  public static before(done) {
    AbstractTestBase.before((err) => {
      if (err) {
        done(err);
        return;
      }
      // ...
      // done([err]);
    });
  }

  public before(done) {
    super.before((err) => {
      if (err) {
        done(err);
        return;
      }
      // ...
      // done([err]);
    });
  }
}
```

With `after()` actions the patterns are similar yet a bit more involved. Note that similar patterns apply when using 
`Promise`s or `async` and `await`.

Important: One should not mix chained calls to both asynchronous and synchronous before and after actions.
If a base class defines either action to be asynchronous then you should make your action asynchronous as well, or
await the outcome of the asynchronous operation.

See [Before and After Actions](https://github.com/pana-cc/mocha-typescript/blob/master/docs/api.md#before-and-after-actions) and 
[Async Tests, Before and After Actions](https://github.com/pana-cc/mocha-typescript/blob/master/docs/api.md#async-tests-before-and-after-actions) for more information.

## Further Reading

 - [Test Source](https://github.com/pana-cc/mocha-typescript/tree/master/test/it)
