import { only, skip, slow, suite, test, timeout } from "../../index";

declare var Promise: any; // ES6 Promise

@suite("mocha typescript")
class Basic {

    @test("should pass when asserts are fine")
    asserts_pass() {
    }

    @test("should fail when asserts are broken")
    asserts_fail() {
        // Any self-respecting assertion framework should throw
        const error = new Error("Assert failed");
        (error as any).expected = "expected";
        (error as any).actual = "to fail";
        throw error;
    }

    @test("should pass async tests")
    assert_pass_async(done) {
        setTimeout(done, 1);
    }

    @test("should fail async when given error")
    assert_fail_async(done) {
        setTimeout(() => done(new Error("Oops...")), 1);
    }

    @test("should fail async when callback not called")
    @timeout(10)
    @skip
    assert_fail_async_no_callback(done) {
        // Never called... t/o intentional.
    }

    @test("should pass when promise resolved")
    promise_pass_resolved() {
        return new Promise((resolve, reject) => {
            setTimeout(() => resolve(), 1);
        });
    }

    @test("should fail when promise rejected")
    promise_fail_rejected() {
        return new Promise((resolve, reject) => {
            setTimeout(() => reject(new Error("Ooopsss...")), 1);
        });
    }
}

//   mocha typescript
//     √ should pass when asserts are fine
//     1) should fail when asserts are broken
//     √ should pass async tests
//     2) should fail async when given error
//     3) should fail async when callback not called
//     √ should pass when promise resolved
//     4) should fail when promise rejected

@suite class CuteSyntax {
    @test testNamedAsMethod() {
    }

    @test "can have non verbose syntax for fancy named tests"() {
    }

    @test "and they can be async too"(done) {
        done();
    }
}

//   CuteSyntax
//     √ testNamedAsMethod
//     √ can have non verbose syntax for fancy named tests
//     √ and they can be async too

@suite class LifeCycle {
    static tokens = 0;
    token: number;

    constructor() {
        console.log("     - new LifeCycle");
    }

    before() {
        this.token = LifeCycle.tokens++;
        console.log("       - Before each test " + this.token);
    }

    after() {
        console.log("       - After each test " + this.token);
    }

    static before() {
        console.log("   - Before the suite: " + ++this.tokens);
    }

    static after() {
        console.log("   - After the suite" + ++this.tokens);
    }

    @test one() {
        console.log("         - Run one: " + this.token);
    }
    @test two() {
        console.log("         - Run two: " + this.token);
    }
}

//   LifeCycle
//    - Before the suite: 1
//      - new LifeCycle
//        - Before each test 1
//          - Run one: 1
//     √ one
//        - After each test 1
//      - new LifeCycle
//        - Before each test 2
//          - Run two: 2
//     √ two
//        - After each test 2
//    - After the suite4

@suite class FailingAsyncLifeCycle {

    constructor() {
    }

    before(done) {
        setTimeout(done, 100);
    }

    after(done) {
        // done() not called... results in "two" not starting because "one" is not completely finished (though the test passes)
        return;
    }

    static before() {
        return new Promise((resolve, reject) => resolve());
    }

    static after() {
        return new Promise((resolve, reject) => reject());
    }

    @test one() {
    }
    @test two() {
    }
}

//   FailingAsyncLifeCycle
//     √ one
//     4) "after each" hook for "one"
//     5) "after all" hook

@suite class PassingAsyncLifeCycle {

    constructor() {
    }

    before(done) {
        setTimeout(() => {
            done();
        }, 100);
    }

    after() {
        return new Promise((resolve, reject) => resolve());
    }

    static before() {
        return new Promise((resolve, reject) => resolve());
    }

    static after(done) {
        setTimeout(() => {
            done();
        }, 300);
        return;
    }

    @test one() {
    }
    @test two() {
    }
}

//   PassingAsyncLifeCycle
//     √ one
//     √ two

@suite class Times {
    @test @slow(10) "when fast is normal"(done) {
        setTimeout(done, 0);
    }
    @test @slow(15) "when average is yellow-ish"(done) {
        setTimeout(done, 10);
    }
    @test @slow(15) "when slow is red-ish"(done) {
        setTimeout(done, 20);
    }
    @test @timeout(10) "when faster than timeout passes"(done) {
        setTimeout(done, 0);
    }
    @test @timeout(10) "when slower than timeout fails"(done) {
        setTimeout(done, 20);
    }
}

//   Times
//     √ when fast is normal
//     √ when average is yellow-ish (10ms)
//     √ when slow is red-ish (20ms)
//     √ when faster than timeout passes
//     6) when slower than timeout fails

@suite class ExecutionControl {
    @skip @test "this won't run"() {
    }

    @test "this however will"() {
    }

    // @only
    @test "add @only to run just this test"() {
    }
}

//   ExecutionControl
//     - this won't run
//     √ this however will
//     √ add @only to run just this test

class ServerTests {
    connect() {
        console.log("      connect(" + ServerTests.connection + ")");
    }
    disconnect() {
        console.log("      disconnect(" + ServerTests.connection + ")");
    }

    static connection: string;
    static connectionId: number = 0;

    static before() {
        ServerTests.connection = "shader connection " + ++ServerTests.connectionId;
        console.log("    boot up server.");
    }

    static after() {
        ServerTests.connection = undefined;
        console.log("    tear down server.");
    }
}

@suite class MobileClient extends ServerTests {
    @test "client can connect"() { this.connect(); }
    @test "client can disconnect"() { this.disconnect(); }
}

@suite class WebClient extends ServerTests {
    @test "web can connect"() { this.connect(); }
    @test "web can disconnect"() { this.disconnect(); }
}

//   MobileClient
//   boot up server.
//     connect(shader connection 1)
//     √ client can connect
//     disconnect(shader connection 1)
//     √ client can disconnect
//   tear down server.

//   WebClient
//   boot up server.
//     connect(shader connection 2)
//     √ web can connect
//     disconnect(shader connection 2)
//     √ web can disconnect
//   tear down server.

@suite @timeout(10) class OverallSlow {
    @test "first fast"(done) {
        setTimeout(done, 1);
    }
    @test "second slow"(done) {
        setTimeout(done, 20);
    }
    @test "third fast"(done) {
        setTimeout(done, 1);
    }
}

//   OverallSlow
//     ✓ first fast
//     7) second slow
//     ✓ third fast

@suite class SlowBefore {
    @timeout(10) before(done) {
        setTimeout(done, 20);
    }
    @test "will fail for slow before"() {}
    after(done) {
        setTimeout(done, 1);
    }
}

@suite class SlowAfter {
    before(done) {
        setTimeout(done, 1);
    }
    @test "will fail for slow after"() {}
    @timeout(10) after(done) {
        setTimeout(done, 20);
    }
}

//   SlowBefore
//     8) "before each" hook for "will fail for slow before"

//   SlowAfter
//     ✓ will fail for slow after
//     9) "after each" hook for "will fail for slow after"

// Nested suites
declare var describe, it;
describe("outer suite", () => {
    @suite class TestClass {
        @test method() {
        }
    }
});

//   outer suite
//     TestClass
//       ✓ method

//   22 passing (3s)
//   2 pending
//   6 failing
