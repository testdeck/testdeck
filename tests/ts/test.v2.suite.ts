import { assert } from "chai";
import { only, skip, skipOnError, slow, suite, test, timeout, trait } from "../../index";

declare var describe, it;

suite("vanila tdd suite", () => {
    test("vanila test", () => {});
    test("vanila failing test", () => { throw new Error("x"); });
    test("vanila asinc", (done) => setTimeout(done, 5));
    test("Vanila promise", () => new Promise((resolve, reject) => setTimeout(resolve, 5)));
    test.pending("pending", () => {});
    test.skip("skipped", () => {});
});

describe("vanila bdd suite", () => {
    it("vanila test", () => {});
    it("vanila failing test", () => { throw new Error("x"); });
    it("vanila asinc", (done) => setTimeout(done, 5));
    it("Vanila promise", () => new Promise((resolve, reject) => setTimeout(resolve, 5)));
    it.skip("skipped", () => {});
});

@suite class Simple {
    @test test() {}
}

@suite(timeout(10))
class Timeouts {
    @test pass1(done) {
        setTimeout(done, 1);
    }
    @test pass2(done) {
        setTimeout(done, 20);
    }
    @test pass3(done) {
        setTimeout(done, 1);
    }
}

@suite(trait((ctx) => ctx.timeout(10)))
class InlineTrait {
    @test timeout(done) {}
}

@suite(skipOnError)
class StockSequence {
    @test step1() {}
    @test step2() { throw new Error("Failed"); }
    @test step3() { /* should be skipped */ }
    @test step4() { /* should be skipped */ }
}

declare var beforeEach, afterEach;
const customSkipOnError = trait(function(ctx, ctor) {
    beforeEach(function() {
        if (ctor.__skip_all) {
            this.skip();
        }
    });
    afterEach(function() {
        if (this.currentTest.state === "failed") {
            ctor.__skip_all = true;
        }
    });
});

@suite(customSkipOnError)
class CustomSequence {
    @test step1() {}
    @test step2() { throw new Error("Failed"); }
    @test step3() { /* should be skipped */ }
    @test step4() { /* should be skipped */ }
}

@suite("name and trait", customSkipOnError)
class CustomSequence2 {
    @test step1() {}
    @test step2() { throw new Error("Failed"); }
    @test step3() { /* should be skipped */ }
}

@suite(slow(10))
class Slows {
    @test pass1(done) {
        setTimeout(done, 1);
    }
    @test pass2(done) {
        setTimeout(done, 20);
    }
    @test pass3(done) {
        setTimeout(done, 1);
    }
}

@suite("mocha typescript")
class Basic {
    @test "assert pass"() {
    }

    @test() "assert pass 2"() {
    }

    @test "test fail"() {
        throw new Error("Fail intentionally!");
    }

    @test() "test fail 2"() {
        throw new Error("Fail intentionally!");
    }

    @test.skip "test skip"() {
    }

    @test(timeout(5))
    "test intentinally timeout"(done) {
        setTimeout(done, 10);
    }

    @test(timeout(20))
    "test intentinall fail due error before timeout"(done) {
        setTimeout(() => done("Ooopsss..."), 5);
    }

    @test(timeout(100), slow(20))
    "test won't timeout but will be redish slow"(done) {
        setTimeout(done, 30);
    }

    @test(timeout(100), slow(20))
    "test won't timeout but will be yellowish slow"(done) {
        setTimeout(done, 15);
    }
}

@suite.skip
class Skipped1 {
    @test test() {}
}

@suite.skip()
class Skipped2 {
    @test test() {}
}

@suite.pending
class Pending1 {
    @test pending() {}
}

@suite.pending()
class Pending2 {
    @test pending() {}
}

@suite.pending(skipOnError)
class Pending3 {
    @test pending() {}
}

@suite("custom suite name")
class Test {
    @test("custom test name") test() {}
}

@suite class InstanceTests {
    static calls = [];
    static beforeInstance;
    before() {
        InstanceTests.calls.push("before");
        assert.isTrue(this instanceof InstanceTests);
        InstanceTests.beforeInstance = this;
    }
    @test test() {
        InstanceTests.calls.push("test");
        assert.isTrue(this instanceof InstanceTests);
        assert.equal(this, InstanceTests.beforeInstance);
    }
    after() {
        InstanceTests.calls.push("after");
        assert.isTrue(this instanceof InstanceTests);
        assert.equal(this, InstanceTests.beforeInstance);
    }
    @test testFailing() {
        InstanceTests.calls.push("testFailing");
        assert.isTrue(false);
    }
    @test beforeAfterCalled() {
        assert.deepEqual(InstanceTests.calls, ["before", "test", "after", "before", "testFailing", "after", "before"]);
    }
}

function task(): Promise<void> {
    return new Promise<void>((resolve) => setTimeout(resolve, 1));
}

@suite class AsyncInstanceTests {
    static calls = [];
    static beforeInstance;
    async before() {
        AsyncInstanceTests.calls.push("before");
        assert.isTrue(this instanceof AsyncInstanceTests);
        AsyncInstanceTests.beforeInstance = this;
        await task();
    }
    @test async test() {
        AsyncInstanceTests.calls.push("test");
        assert.isTrue(this instanceof AsyncInstanceTests);
        assert.equal(this, AsyncInstanceTests.beforeInstance);
    }
    async after() {
        await task();
        AsyncInstanceTests.calls.push("after");
        assert.isTrue(this instanceof AsyncInstanceTests);
        assert.equal(this, AsyncInstanceTests.beforeInstance);
        await task();
    }
    @test async testFailing() {
        AsyncInstanceTests.calls.push("testFailing");
        assert.isTrue(false);
        await task();
    }
    @test async beforeAfterCalled() {
        assert.deepEqual(AsyncInstanceTests.calls, [
            "before", "test", "after", "before", "testFailing", "after", "before",
        ]);

        await task();
    }
    toString() {
        return "AsyncInstanceTests";
    }
}
