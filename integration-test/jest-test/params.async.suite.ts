import { assert } from "chai";
import { params, suite } from "../src/";

@suite
class ParamsAsyncSuite {

  @params({ a: 1, b: 2, c: 3, failing: false })
  // we need an integration for these
  @params.skip({ a: 1, b: 2, c: 3, failing: true }) // failing sut here
  @params.skip({ a: 1, b: 2, c: 4, failing: false }) // failing assertion here
  public callbackTest(done, { a, b, c, failing }) {

    const sut = new SystemUnderTest();
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
  // we need an integration for these
  @params.skip({ a: 1, b: 2, c: 3, failing: true }) // failing sut here
  @params.skip({ a: 1, b: 2, c: 4, failing: false }) // failing assertion here
  public async asyncTest({ a, b, c, failing }) {

    const sut = new SystemUnderTest();
    assert.equal(c, await sut.asyncMethod(a, b, failing));
  }

  @params({ a: 1, b: 2, c: 3, failing: false })
  // we need an integration for these
  @params.skip({ a: 1, b: 2, c: 3, failing: true }) // failing sut here
  @params.skip({ a: 1, b: 2, c: 4, failing: false }) // failing assertion here
  public async promiseTest({ a, b, c, failing }) {

    const sut = new SystemUnderTest();
    const promise = sut.promiseMethod(a, b, failing);

    return promise.then((result) => {

      assert.equal(c, result);
    });
  }
}

class SystemUnderTest {

  public callbackMethod(a, b, failing, cb: (error, result) => void): void {

    cb(failing ? new Error("sut failed") : null, a + b);
  }

  public async asyncMethod(a, b, failing): Promise<number> {

    return this.promiseMethod(a, b, failing);
  }

  public promiseMethod(a, b, failing): Promise<number> {

    if (failing) {

      return Promise.reject(new Error("sut failed"));
    }

    return Promise.resolve(a + b);
  }
}
