# mocha-typescript

[![Get it on NPM](https://img.shields.io/npm/v/mocha-typescript.svg)](https://www.npmjs.com/package/mocha-typescript)
[![Downloads per Week](https://img.shields.io/npm/dw/mocha-typescript.svg)](https://www.npmjs.com/package/mocha-typescript)
[![Dependencies](https://img.shields.io/librariesio/github/pana-cc/mocha-typescript.svg)](https://libraries.io/npm/mocha-typescript)
[![Issues](https://img.shields.io/github/issues/pana-cc/mocha-typescript.svg)](https://github.com/pana-cc/mocha-typescript/issues)
[![Pull Requests](https://img.shields.io/github/issues-pr/pana-cc/mocha-typescript.svg)](https://github.com/pana-cc/mocha-typescript/pulls)
[![Travis Build Status](https://img.shields.io/travis/pana-cc/mocha-typescript/master.svg)](https://travis-ci.org/pana-cc/mocha-typescript)
[![Appveyor Build Status](https://img.shields.io/appveyor/ci/pana-cc/mocha-typescript.svg)](https://ci.appveyor.com/project/pana-cc/mocha-typescript)
![Apache 2.0 License](https://img.shields.io/npm/l/mocha-typescript.svg)

## Parameterised Tests

You can parameterise your test methods with the `@params` decorator. The decorator takes at most two arguments, the first
one being an object with the actual test parameters and the optional second one being a dedicated name for the test.

```TypeScript
@suite
class TestSuite {
  
  @params({ a: 1, b: 2, c: 3 })
  @params({ a: 4, b: 5, c: 9 })
  test({ a, b, c }) {
    
    assert.equal(c, sut.add(a, b));
  }
}
```

For starters, have a look at a [working example](https://github.com/pana-cc/mocha-typescript/blob/master/test/it/fixtures/params.suite.ts).

### Naming Parameterised Tests

By default all parameterised tests will be named ``${testName}_${i}``, where `testName` is the name of the test method
and `i` is the index position of the parameter set. So if you have multiple ``@params`` decorators in place, the last
will be assigned the index position `0`, the last but one will be assigned the index position `1` and so on.

You can override the default behaviour by either providing a name for each parameter set explicitly, or by using the 
``@params.naming`` decorator. The decorator takes a function as its single argument that returns the name of the test 
method for a specific set of parameters.

The order by which tests are named is as follows

- explicit name passed in as a parameter to the ``@params`` decorator
- name derived from the naming function passed in as a parameter to the ``@params.naming`` decorator
- the default name

```TypeScript
@suite
class TestSuite {
  
  @params({ a: 1, b: 2, c: 3 }) // index position 2
  @params({ a: 4, b: 5, c: 9 }) // index position 1
  @params.naming(({ a, b, c }) => `adding ${a} and ${b} must equal ${c}`)
  test({ a, b, c }) {
    
    assert.equal(c, sut.add(a, b));
  }
  
  @params({ a: 1, b: 2, c: 3 }, "1 + 2 === 3") // test name will be 1 + 2 === 3
  @params({ a: 4, b: 5, c: 9 }) // test name will be derived from the function passed to @params.naming below
  @params.naming(({ a, b, c }) => `adding ${a} and ${b} must equal ${c}`)
  test2({ a, b, c }) {
    
    assert.equal(c, sut.add(a, b));
  }
}
```

For starters, have a look at a [working example](https://github.com/pana-cc/mocha-typescript/blob/master/test/it/fixtures/params.naming.suite.ts).

### Skipping Individual Parameter Sets
As with standard tests, you can also skip individual parameter sets using the ``@params.skip`` decorator.
```TypeScript
@suite
class TestSuite {
  
  @params({ a: 1, b: 2, c: 3 })
  @params.skip({ a: 4, b: 5, c: 6 }, "4 + 5 === 9") // test is failing, skipping for now
  test({ a, b, c }) {
    
    assert.equal(c, sut.add(a, b));
  }
}
```

For starters, have a look at a [working example](https://github.com/pana-cc/mocha-typescript/blob/master/test/it/fixtures/params.skip.suite.ts).

### Testing With Only Some Parameter Sets

```TypeScript
@suite
class TestSuite {
  
  @params.only({ a: 1, b: 2, c: 3 })
  @params({ a: 4, b: 5, c: 9 }) // will not be executed
  test({ a, b, c }) {
    
    assert.equal(c, sut.add(a, b));
  }
}
```
For starters, have a look at a [working example](https://github.com/pana-cc/mocha-typescript/blob/master/test/it/fixtures/params.only.suite.ts).

### Asynchronous Parameterised Tests
Just like regular tests, parameterised tests can also be asynchronous, e.g.
```TypeScript
@suite
class ParamsAsyncSuite {

  @params({ a: 1, b: 2, c: 3, failing: false })
  @params({ a: 1, b: 2, c: 3, failing: true }) // failing sut here
  @params({ a: 1, b: 2, c: 4, failing: false }) // failing assertion here
  public callbackTest(done, { a, b, c, failing }) {

    sut.callbackMethod(a, b, failing, (error, result) => {

      if (error) {

        done(error);
      } else {

        try {

          assert.equal(result, c);
          done();
        } catch (err) {

          done(err);
        }
      }
    });
  }

  @params({ a: 1, b: 2, c: 3, failing: false })
  @params({ a: 1, b: 2, c: 3, failing: true }) // failing sut here
  @params({ a: 1, b: 2, c: 4, failing: false }) // failing assertion here
  public async asyncTest({ a, b, c, failing }) {

    assert.equal(c, await sut.asyncMethod(a, b, failing));
  }

  @params({ a: 1, b: 2, c: 3, failing: false })
  @params({ a: 1, b: 2, c: 3, failing: true }) // failing sut here
  @params({ a: 1, b: 2, c: 4, failing: false }) // failing assertion here
  public async promiseTest({ a, b, c, failing }) {

    const promise = sut.promiseMethod(a, b, failing);

    return promise.then((result) => {

      assert.equal(c, result);
    })
  }
}
```
For starters, have a look at a [working example](https://github.com/pana-cc/mocha-typescript/blob/master/test/it/fixtures/params.async.suite.ts).
