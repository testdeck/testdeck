// Copyright 2016-2022 Testdeck Team and Contributors
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { assert } from "chai";
import { context, retries, slow, suite, test, timeout } from "./index";

describe("tests", function() {

    let events: string[];

    @suite class Suite {
        public static before() {
            events.push("Suite static before");
        }

        public before() {
            events.push("Suite before");
        }

        @test(timeout(1000), slow(500), retries(3))
        public test() {
            events.push("Suite test");
        }

        @test.pending(timeout(1000)) public pendingTest() {
            events.push("Suite pendingTest");
        }

        @test.skip(slow(500)) public skippedTest() {
            events.push("Suite skippedTest");
        }

        public after() {
            events.push("Suite after");
        }

        public static after() {
            events.push("Suite static after");
        }
    }

    @suite class CallbacksSuite {
        public static before(done) {
            events.push("CallbacksSuite static before");
            setTimeout(done, 50);
        }

        public before(done) {
            events.push("CallbacksSuite before");
            setTimeout(done, 50);
        }

        @test(timeout(1000), slow(500), retries(3))
        public test(done) {
            events.push("CallbacksSuite test");
            setTimeout(done, 50);
        }

        @test
        @timeout(1000)
        public test2(done) {
            events.push("CallbacksSuite test2");
            setTimeout(done, 50);
        }

        @test
        @retries(100)
        public test3(done) {
            events.push("CallbacksSuite test3");
            setTimeout(done, 50);
        }

        @test.pending(timeout(1000))
        public pendingTest(done) {
            events.push("CallbacksSuite pendingTest");
            setTimeout(done, 50);
        }

        @test.skip(slow(500))
        public skippedTest(done) {
            events.push("CallbacksSuite skippedTest");
            setTimeout(done, 50);
        }

        public after(done) {
            events.push("CallbacksSuite after");
            setTimeout(done, 50);
        }

        public static after(done) {
            events.push("CallbacksSuite static after");
            setTimeout(done, 50);
        }
    }

    @suite.pending class PendintSuite {
        @test public test() {
            events.push("PendintSuite test");
        }
    }

    @suite.skip class SkippedSuite {
        @test public test() {
            events.push("SkippedSuite test");
        }
    }

    @suite class SuiteContext {

        static async before() {
            assert.isDefined(this[context]);
            events.push("Has mocha before all suite context");
        }

        before() {
            assert.isDefined(this[context]);
            events.push("Has mocha before each suite context");
        }

        @test testHasContext(done) {
            // Got mocha context:
            this[context].timeout(1000);
            setTimeout(done, 50);
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

declare var setTimeout;
