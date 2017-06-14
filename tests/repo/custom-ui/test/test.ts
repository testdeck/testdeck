/// <reference path="../node_modules/mocha-typescript/globals.d.ts" />
import { assert } from "chai";

@suite class Suite1 {
    @test "one"() {
        // one passes
    }
    @test "two"() {
        // tow fails
        throw new Error("instant fail");
    }
    @test "three"() {
        return new Promise((resolve, reject) => {
            setTimeout(resolve, 10);
        });
    }
    @test "four"() {
        return new Promise((resolve, reject) => {
            setTimeout(() => reject(new Error("async fail")), 10);
        });
    }
    @test.skip "five"() {
        
    }
}

@suite.skip class Skip1 {
    @test one() {}
    @test two() {}
}

@suite(timeout(10))
class TimoutSuite {
    @test fast(done: MochaDone) {
        setTimeout(done, 5);
    }
    @test slow(done: MochaDone) {
        setTimeout(done, 20);
    }
}

@suite class TimeoutSuite2 {
    @test(timeout(20)) fast(done: MochaDone) {
        setTimeout(done, 5);
    }
    @test(timeout(20)) slow(done: MochaDone) {
        setTimeout(done, 20);
    }
}

@suite(skipOnError)
class SequenceOne {
    @test one() {}
    @test two() { throw new Error("Fail!"); }
    @test three() { /* this will skip since two fails */ }
}

@suite(skipOnError)
class SequenceTwo {
    @test one() {}
    @test two() {}
    @test three() {}
}

@suite("named")
class NamedSuite {
    @test("with name")
    testMethod() {
    }
}

@suite class InstanceTests {
    static calls: string[] = [];
    static beforeInstance: InstanceTests;
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
    return new Promise<void>(resolve => setTimeout(resolve, 1));
}

@suite class AsyncInstanceTests {
    static calls: string[] = [];
    static beforeInstance: AsyncInstanceTests;
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
        assert.deepEqual(AsyncInstanceTests.calls, ["before", "test", "after", "before", "testFailing", "after", "before"]);
        await task();
    }
    toString() {
        return "AsyncInstanceTests";
    }
}
