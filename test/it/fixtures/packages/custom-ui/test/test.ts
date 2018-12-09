import { assert } from "chai";
import { IN_TIME, OVERLY_SLOW, RATHER_SLOW, TIMEOUT } from '../../../../constants';
import { retries, skipOnError, suite, test, timeout } from 'mocha-typescript';

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

@suite(timeout(TIMEOUT))
class TimoutSuite {
    @test fast(done: MochaDone) {
        setTimeout(done, IN_TIME);
    }
    @test slow(done: MochaDone) {
        setTimeout(done, OVERLY_SLOW);
    }
}

@suite class TimeoutSuite2 {
    @test(timeout(TIMEOUT)) fast(done: MochaDone) {
        setTimeout(done, IN_TIME);
    }
    @test(timeout(TIMEOUT)) slow(done: MochaDone) {
        setTimeout(done, OVERLY_SLOW);
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

@suite class FlakyMethodDecorator {
    private static runCount1 = 0;
    private static runCount2 = 0;
    private static runCount3 = 0;

    @test(retries(1)) tryOnce() {
        FlakyMethodDecorator.runCount1++;
        assert.isAbove(FlakyMethodDecorator.runCount1, 2);
    }

    @test(retries(2)) tryTwice() {
        FlakyMethodDecorator.runCount2++;
        assert.isAbove(FlakyMethodDecorator.runCount2, 2);
    }

    @test(retries(3)) tryTrice() {
        FlakyMethodDecorator.runCount3++;
        assert.isAbove(FlakyMethodDecorator.runCount3, 2);
    }
}

@suite(retries(3)) class FlakySuiteDecorator {
    private static runCount1 = 0;
    private static runCount2 = 0;
    private static runCount3 = 0;

    @test tryToGetPass2() {
        FlakySuiteDecorator.runCount1++;
        assert.isAbove(FlakySuiteDecorator.runCount1, 2);
    }

    @test tryToGetPass4() {
        FlakySuiteDecorator.runCount2++;
        assert.isAbove(FlakySuiteDecorator.runCount2, 4);
    }

    @test(retries(4)) overrideSuiteRetries() {
        FlakySuiteDecorator.runCount3++;
        assert.isAbove(FlakySuiteDecorator.runCount3, 4);
    }
}
