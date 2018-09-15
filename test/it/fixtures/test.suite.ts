import { only, skip, slow, suite, test, timeout } from "../../../index";

@suite("mocha typescript")
class Basic {

    @test("should pass when asserts are fine")
    public asserts_pass() {
    }

    @test("should fail when asserts are broken")
    public asserts_fail() {
        // Any self-respecting assertion framework should throw
        const error = new Error("Assert failed");
        (error as any).expected = "expected";
        (error as any).actual = "to fail";
        throw error;
    }

    @test("should pass async tests")
    public assert_pass_async(done) {
        setTimeout(done, 1);
    }

    @test("should fail async when given error")
    public assert_fail_async(done) {
        setTimeout(() => done(new Error("Oops...")), 1);
    }

    @test("should fail async when callback not called")
    @timeout(10)
    @skip
    public assert_fail_async_no_callback(done) {
        // Never called... t/o intentional.
    }

    @test("should pass when promise resolved")
    public promise_pass_resolved() {
        return new Promise((resolve, reject) => {
            setTimeout(() => resolve(), 1);
        });
    }

    @test("should fail when promise rejected")
    public promise_fail_rejected() {
        return new Promise((resolve, reject) => {
            setTimeout(() => reject(new Error("Ooopsss...")), 1);
        });
    }

    public classesMayHaveNonTestMethods() {
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
    @test public testNamedAsMethod() {
    }

    @test public "can have non verbose syntax for fancy named tests"() {
    }

    @test public "and they can be async too"(done) {
        done();
    }
}

//   CuteSyntax
//     √ testNamedAsMethod
//     √ can have non verbose syntax for fancy named tests
//     √ and they can be async too

@suite class LifeCycle {
    public static tokens = 0;
    public token: number;

    constructor() {
        console.log("     - new LifeCycle");
    }

    public before() {
        this.token = LifeCycle.tokens++;
        console.log("       - Before each test " + this.token);
    }

    public after() {
        console.log("       - After each test " + this.token);
    }

    public static before() {
        console.log("   - Before the suite: " + ++this.tokens);
    }

    public static after() {
        console.log("   - After the suite" + ++this.tokens);
    }

    @test public one() {
        console.log("         - Run one: " + this.token);
    }
    @test public two() {
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

    public before(done) {
        setTimeout(done, 100);
    }

    public after(done) {
        // done() not called... results in "two" not starting because "one" is not completely finished (though the test passes)
        return;
    }

    public static before() {
        return new Promise((resolve, reject) => resolve());
    }

    public static after() {
        return new Promise((resolve, reject) => reject());
    }

    @test public one() {
    }
    @test public two() {
    }
}

//   FailingAsyncLifeCycle
//     √ one
//     4) "after each" hook for "one"
//     5) "after all" hook
//
@suite class PassingAsyncLifeCycle {
//
    constructor() {
    }
//
    public before(done) {
        setTimeout(() => {
            done();
        }, 100);
    }
//
    public after() {
        return new Promise((resolve, reject) => resolve());
    }
//
    public static before() {
        return new Promise((resolve, reject) => resolve());
    }
//
    public static after(done) {
        setTimeout(() => {
            done();
        }, 300);
        return;
    }
//
    @test public one() {
    }
    @test public two() {
    }
}
//
//   PassingAsyncLifeCycle
//     √ one
//     √ two
//
@suite class Times {
    @test @slow(10) public "when fast is normal"(done) {
        setTimeout(done, 0);
    }
    @test @slow(15) public "when average is yellow-ish"(done) {
        setTimeout(done, 10);
    }
    @test @slow(15) public "when slow is red-ish"(done) {
        setTimeout(done, 20);
    }
    @test @timeout(10) public "when faster than timeout passes"(done) {
        setTimeout(done, 0);
    }
    @test @timeout(10) public "when slower than timeout fails"(done) {
        setTimeout(done, 20);
    }
}
//
//   Times
//     √ when fast is normal
//     √ when average is yellow-ish (10ms)
//     √ when slow is red-ish (20ms)
//     √ when faster than timeout passes
//     6) when slower than timeout fails
//
@suite class ExecutionControl {
    @skip @test public "this won't run"() {
    }
//
    @test public "this however will"() {
    }
//
    // @only
    @test public "add @only to run just this test"() {
    }
}
//
//   ExecutionControl
//     - this won't run
//     √ this however will
//     √ add @only to run just this test
//
class ServerTests {
    public connect() {
        console.log("      connect(" + ServerTests.connection + ")");
    }
    public disconnect() {
        console.log("      disconnect(" + ServerTests.connection + ")");
    }
//
    public static connection: string;
    public static connectionId: number = 0;
//
    public static before() {
        ServerTests.connection = "shader connection " + ++ServerTests.connectionId;
        console.log("    boot up server.");
    }
//
    public static after() {
        ServerTests.connection = undefined;
        console.log("    tear down server.");
    }
}
//
@suite class MobileClient extends ServerTests {
    @test public "client can connect"() { this.connect(); }
    @test public "client can disconnect"() { this.disconnect(); }
}
//
@suite class WebClient extends ServerTests {
    @test public "web can connect"() { this.connect(); }
    @test public "web can disconnect"() { this.disconnect(); }
}
//
//   MobileClient
//   boot up server.
//     connect(shader connection 1)
//     √ client can connect
//     disconnect(shader connection 1)
//     √ client can disconnect
//   tear down server.
//
//   WebClient
//   boot up server.
//     connect(shader connection 2)
//     √ web can connect
//     disconnect(shader connection 2)
//     √ web can disconnect
//   tear down server.
//
@suite @timeout(10) class OverallSlow {
    @test public "first fast"(done) {
        setTimeout(done, 1);
    }
    @test public "second slow"(done) {
        setTimeout(done, 20);
    }
    @test public "third fast"(done) {
        setTimeout(done, 1);
    }
}
//
//   OverallSlow
//     ✓ first fast
//     7) second slow
//     ✓ third fast
//
@suite class SlowBefore {
    @timeout(10) public before(done) {
        setTimeout(done, 20);
    }
    @test public "will fail for slow before"() {}
    public after(done) {
        setTimeout(done, 1);
    }
}
//
@suite class SlowAfter {
    public before(done) {
        setTimeout(done, 1);
    }
    @test public "will fail for slow after"() {}
    @timeout(10) public after(done) {
        setTimeout(done, 20);
    }
}
//
//   SlowBefore
//     8) "before each" hook for "will fail for slow before"
//
//   SlowAfter
//     ✓ will fail for slow after
//     9) "after each" hook for "will fail for slow after"
//
// Nested suites
declare var describe;
declare var it;
//
describe("outer suite", () => {
    @suite class TestClass {
        @test public method() {
        }
    }
});
//
//   outer suite
//     TestClass
//       ✓ method
//
//   22 passing (3s)
//   2 pending
//   6 failing
