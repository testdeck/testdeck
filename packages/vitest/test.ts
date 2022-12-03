import { assert } from "chai";
import { beforeAll, describe, test } from "vitest";
import { retries, slow, suite, test as test_, timeout } from "./index";

describe("tests", function() {

    let events: string[];

    @suite class Suite {
        public static before() {
            events.push("Suite static before");
        }

        public before() {
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
            events.push("Suite after");
        }

        public static after() {
            events.push("Suite static after");
        }
    }

    @suite class AsyncSuite {
        public static async before() {
            events.push("AsyncSuite static before all");
            return Promise.resolve();
        }

        public async before() {
            events.push("AsyncSuite before each");
	    return Promise.resolve();
        }

        @test_
        public async test() {
            events.push("AsyncSuite simple test");
	    return Promise.resolve();
        }

        @test_(timeout(1000), slow(500), retries(3))
        public async testAllInOne() {
            events.push("AsyncSuite test all in one");
	    return Promise.resolve();
        }

        @test_
        @timeout(1000)
        public async test2() {
            events.push("AsyncSuite timeout test");
	    return Promise.resolve();
        }

        @test_
        @retries(100)
        public async test3() {
            events.push("AsyncSuite retries test");
	    return Promise.resolve();
        }

        @test_.pending(timeout(1000))
        public async pendingTest() {
            events.push("AsyncSuite pendingTest");
	    return Promise.resolve();
        }

        @test_.skip(slow(500))
        public async skippedTest() {
            events.push("AsyncSuite skippedTest");
	    return Promise.resolve();
        }

        public async after() {
            events.push("AsyncSuite after each");
	    return Promise.resolve();
        }

        public static async after() {
            events.push("AsyncSuite static after all");
	    return Promise.resolve();
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
            "AsyncSuite static before all",
            "AsyncSuite before each",
            "AsyncSuite simple test",
            "AsyncSuite after each",
            "AsyncSuite before each",
            "AsyncSuite test all in one",
            "AsyncSuite after each",
            "AsyncSuite before each",
            "AsyncSuite timeout test",
            "AsyncSuite after each",
            "AsyncSuite before each",
            "AsyncSuite retries test",
            "AsyncSuite after each",
            "AsyncSuite static after all"
        ]);
    });
});

declare var setTimeout;
