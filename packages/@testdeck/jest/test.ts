import { assert } from "chai";
import { retries, slow, suite, test as test_, timeout } from "./index";

describe("tests", function() {

    let events: string[];

    @suite class Suite {
        public static before() {
            events.push("Suite static before");
        }

        public before() {
            assert(this).instanceOf(Suite);
            events.push("Suite before");
        }

        @test_(timeout(1000), slow(500), retries(3))
        public test() {
            events.push("Suite test");
        }

        @test_.pending(timeout(1000)) public pendingTest() {
            events.push("Suite pendingTest");
        }

        @test_.skip(slow(500)) public skippedTest() {
            events.push("Suite skippedTest");
        }

        public after() {
            assert(this).instanceOf(Suite);
            events.push("Suite after");
        }

        public static after() {
            events.push("Suite static after");
        }
    }

    @suite class CallbacksSuite {
        public static before(done) {
            events.push("CallbacksSuite static before");
            setTimeout(done, 0);
        }

        public before(done) {
            assert(this).instanceOf(CallbacksSuite);
            events.push("CallbacksSuite before");
            setTimeout(done, 0);
        }

        @test_(timeout(1000), slow(500), retries(3))
        public test(done) {
            events.push("CallbacksSuite test");
            setTimeout(done, 0);
        }

        @test_
        @timeout(100)
        public test2(done) {
            events.push("CallbacksSuite test2");
            setTimeout(done, 1);
        }

        @test_
        @retries(100)
        public test3(done) {
            events.push("CallbacksSuite test3");
            setTimeout(done, 1);
        }

        @test_.pending(timeout(1000))
        public pendingTest(done) {
            events.push("CallbacksSuite pendingTest");
            setTimeout(done, 0);
        }

        @test_.skip(slow(500))
        public skippedTest(done) {
            events.push("CallbacksSuite skippedTest");
            setTimeout(done, 0);
        }

        public after(done) {
            assert(this).instanceOf(CallbacksSuite);
            events.push("CallbacksSuite after");
            setTimeout(done, 0);
        }

        public static after(done) {
            events.push("CallbacksSuite static after");
            setTimeout(done, 0);
        }
    }

    @suite.pending class PendintSuite {
        @test_ public test() {
            events.push("PendintSuite test");
        }
    }

    @suite.skip class SkippedSuite {
        @test_ public test() {
            events.push("SkippedSuite test");
        }
    }

    beforeAll(function() {
        events = [];
    });

    test("order of execution", function() {
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
            "CallbacksSuite static after"
        ]);
    });
});

declare var setTimeout;
