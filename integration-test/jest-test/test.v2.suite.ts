import { assert } from "chai";
import { skipOnError, slow, suite, test, timeout, trait } from "../src/";
import { IN_TIME, OVERLY_SLOW, RATHER_SLOW, SLOW, TIMEOUT } from "./constants";
import * as util from 'util';

describe("vanila bdd suite", () => {
    it("vanila test", () => {});
    // do we really need to test this?
    // it("vanila failing test", () => { throw new Error("x"); });
    it("vanila asinc", (done) => setTimeout(done, 5));
    it("Vanila promise", () => new Promise((resolve, reject) => setTimeout(resolve, 5)));
    it.skip("skipped", () => {});
});

@suite class Simple {
    @test public test() {}
}

// duplicate of existing other timeout tests
@suite.skip(timeout(TIMEOUT))
class Timeouts {
    @test public pass1(done) {
        setTimeout(done, IN_TIME);
    }
    @test public pass2(done) {
        setTimeout(done, OVERLY_SLOW);
    }
    @test public pass3(done) {
        setTimeout(done, IN_TIME);
    }
}

// jest.setTimeout sets the timeout globally, so this is actually not a good test
@suite.skip(trait((ctx) => jest.setTimeout(TIMEOUT)))
class InlineTrait {
    @test public timeout(done) { done(); }
}

// jest does not support slow
@suite.skip(slow(TIMEOUT))
class Slows {
    @test public pass1(done) {
        setTimeout(done, IN_TIME);
    }
    @test public pass2(done) {
        setTimeout(done, SLOW);
    }
    @test public pass3(done) {
        setTimeout(done, IN_TIME);
    }
}

@suite("mocha typescript")
class Basic {
    @test public "assert pass"() {
    }

    @test() public "assert pass 2"() {
    }

    // do we really need to test this?
    @test.skip public "test fail"() {
        throw new Error("Fail intentionally!");
    }

    // do we really need to test this?
    @test.skip() public "test fail 2"() {
        throw new Error("Fail intentionally!");
    }

    @test.skip public "test skip"() {
    }

    // do we really need to test this?
    @test.skip(timeout(TIMEOUT))
    public "test intentinally timeout"(done) {
        setTimeout(done, OVERLY_SLOW);
    }

    // do we really have to test for failing tests?
    @test.skip(timeout(TIMEOUT))
    public "test intentinall fail due error before timeout"(done) {
        setTimeout(() => done("Ooopsss..."), IN_TIME);
    }

    // there is no support for slow in jest
    @test.skip(timeout(TIMEOUT * 2), slow(SLOW))
    public "test won't timeout but will be redish slow"(done) {
        setTimeout(done, RATHER_SLOW);
    }

    // there is no support for slow in jest
    @test.skip(timeout(TIMEOUT * 2), slow(SLOW))
    public "test won't timeout but will be yellowish slow"(done) {
        setTimeout(done, OVERLY_SLOW);
    }
}

@suite.skip
class Skipped1 {
    @test public test() {}
}

@suite.skip()
class Skipped2 {
    @test public test() {}
}

@suite.pending
class Pending1 {
    @test public pending() {}
}

@suite.pending()
class Pending2 {
    @test public pending() {}
}

@suite.pending(skipOnError)
class Pending3 {
    @test public pending() {}
}

@suite("custom suite name")
class Test {
    @test("custom test name") public test() {}
}

@suite class InstanceTests {
    public static calls = [];
    public static beforeInstance;
    public before() {
        InstanceTests.calls.push("before");
        assert.isTrue(this instanceof InstanceTests);
        InstanceTests.beforeInstance = this;
    }
    @test public test() {
        InstanceTests.calls.push("test");
        assert.isTrue(this instanceof InstanceTests);
        assert.equal(this, InstanceTests.beforeInstance);
    }
    public after() {
        InstanceTests.calls.push("after");
        assert.isTrue(this instanceof InstanceTests);
        assert.equal(this, InstanceTests.beforeInstance);
    }
    // do we really need to test this?
    @test.skip public testFailing() {
        InstanceTests.calls.push("testFailing");
        assert.isTrue(false);
    }
    @test public beforeAfterCalled() {
        // assert.deepEqual(InstanceTests.calls, ["before", "test", "after", "before", "testFailing", "after", "before"]);
        assert.deepEqual(InstanceTests.calls, ["before", "test", "after", "before"]);
    }
}

function task(): Promise<void> {
    return new Promise<void>((resolve) => setTimeout(resolve, 1));
}

// duplicate of async.suite
@suite.skip class AsyncInstanceTests {
    public static calls = [];
    public static beforeInstance;
    public async before() {
        AsyncInstanceTests.calls.push("before");
        assert.isTrue(this instanceof AsyncInstanceTests);
        AsyncInstanceTests.beforeInstance = this;
        await task();
    }
    @test public async test() {
        AsyncInstanceTests.calls.push("test");
        assert.isTrue(this instanceof AsyncInstanceTests);
        assert.equal(this, AsyncInstanceTests.beforeInstance);
    }
    public async after() {
        await task();
        AsyncInstanceTests.calls.push("after");
        assert.isTrue(this instanceof AsyncInstanceTests);
        assert.equal(this, AsyncInstanceTests.beforeInstance);
        await task();
    }
    @test public async testFailing() {
        AsyncInstanceTests.calls.push("testFailing");
        assert.isTrue(false);
        await task();
    }
    @test public async beforeAfterCalled() {
        assert.deepEqual(AsyncInstanceTests.calls, ["before", "test", "after", "before", "testFailing", "after", "before"]);
        await task();
    }
    public toString() {
        return "AsyncInstanceTests";
    }
}
