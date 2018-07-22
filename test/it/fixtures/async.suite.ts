import { assert } from "chai";
import { suite, test } from "../../../index";

// TODO: Assert that the callbacks are actually called and end is awaited.

@suite()
class AsyncSuite {
    static staticBeforeCalledAndAwaited = false;
    static instanceBeforeCalledAndAwaited = false;
    static testAwaited = false;
    static instanceAfterCalledAndAwaited = false;
    static staticAfterCalledAndAwaited = false;

    static before(done) {
        setTimeout(() => {
            AsyncSuite.staticBeforeCalledAndAwaited = true;
            done();
        }, 1);
    }

    before(done) {
        assert(AsyncSuite.staticBeforeCalledAndAwaited);
        setTimeout(() => {
            AsyncSuite.instanceBeforeCalledAndAwaited = true;
            done();
        }, 1);
    }

    @test test(done) {
        assert(AsyncSuite.instanceBeforeCalledAndAwaited);
        setTimeout(() => {
            AsyncSuite.testAwaited = true;
            done();
        }, 1);
    }

    after(done) {
        assert(AsyncSuite.testAwaited);
        setTimeout(() => {
            AsyncSuite.instanceAfterCalledAndAwaited = true;
            done();
        }, 1);
    }

    static after(done) {
        assert(AsyncSuite.instanceAfterCalledAndAwaited);
        setTimeout(() => {
            AsyncSuite.staticAfterCalledAndAwaited = true;
            done();
        }, 1);
    }
}
@suite()
class AsyncSuiteAfterAssert {
    @test assertStaticAfterCalledAndAwaited() {
        assert(AsyncSuite.staticAfterCalledAndAwaited);
    }
}