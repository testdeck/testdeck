import { assert } from "chai";
import { retries, slow, suite, test, timeout, Done } from "./index";
// FIXME context access is untyped and causes eslint issues
// import { context } from "./index";

/* eslint-disable @typescript-eslint/no-unused-vars */

describe("tests", function() {

    let events: string[];

    @suite class Suite {
        static before() {
            events.push("Suite static before");
        }

        before() {
            events.push("Suite before");
        }

        @test(timeout(1000), slow(500), retries(3))
        test() {
            events.push("Suite test");
        }

        @test.pending(timeout(1000)) pendingTest() {
            events.push("Suite pendingTest");
        }

        @test.skip(slow(500)) skippedTest() {
            events.push("Suite skippedTest");
        }

        after() {
            events.push("Suite after");
        }

        static after() {
            events.push("Suite static after");
        }
    }

    @suite class CallbacksSuite {
        static before(done : Done) {
            events.push("CallbacksSuite static before");
            setTimeout(done, 0);
        }

        before(done : Done) {
            events.push("CallbacksSuite before");
            setTimeout(done, 0);
        }

        @test(timeout(1000), slow(500), retries(3))
        test(done : Done) {
            events.push("CallbacksSuite test");
            setTimeout(done, 0);
        }

        @test
        @timeout(100)
        test2(done : Done) {
            events.push("CallbacksSuite test2");
            setTimeout(done, 1);
        }

        @test
        @retries(100)
        test3(done : Done) {
            events.push("CallbacksSuite test3");
            setTimeout(done, 1);
        }

        @test.pending(timeout(1000))
        pendingTest(done : Done) {
            events.push("CallbacksSuite pendingTest");
            setTimeout(done, 0);
        }

        @test.skip(slow(500))
        skippedTest(done : Done) {
            events.push("CallbacksSuite skippedTest");
            setTimeout(done, 0);
        }

        after(done : Done) {
            events.push("CallbacksSuite after");
            setTimeout(done, 0);
        }

        static after(done : Done) {
            events.push("CallbacksSuite static after");
            setTimeout(done, 0);
        }
    }

    @suite.pending class PendintSuite {
        @test test() {
            events.push("PendintSuite test");
        }
    }

    @suite.skip class SkippedSuite {
        @test test() {
            events.push("SkippedSuite test");
        }
    }

    @suite class SuiteContext {

        static before() {
            // FIXME access to context symbol returns any
            // this[context].timeout(50);
            events.push("Has mocha before all suite context");
        }

        before() {
            // FIXME access to context symbol returns any
            // this[context].timeout(50);
            events.push("Has mocha before each suite context");
        }

        @test testHasContext(done : Done) {
            // Got mocha context:
            // FIXME access to context symbol returns any
            // this[context].timeout(50);
            setTimeout(done, 0);
            events.push("Has mocha test context");
        }
    }

    before(function() {
        events = [];
    });

    // must put this into a separate suite as mocha will run the outer suite's tests first
    describe("order of", function() {
        it("execution", function() {
            assert.sameOrderedMembers(events, [
                "Suite static before",
                "Suite before",
                "Suite test",
                "Suite after",
                "Suite static after",
                "CallbacksSuite static before",
                "CallbacksSuite before",
                "CallbacksSuite test",
                "CallbacksSuite after",
                "CallbacksSuite before",
                "CallbacksSuite test2",
                "CallbacksSuite after",
                "CallbacksSuite before",
                "CallbacksSuite test3",
                "CallbacksSuite after",
                "CallbacksSuite static after",
                "Has mocha before all suite context",
                "Has mocha before each suite context",
                "Has mocha test context"
            ]);
        });
    });
});
