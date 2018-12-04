# mocha-typescript

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
