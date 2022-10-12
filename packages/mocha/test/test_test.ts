// Copyright 2022 Testdeck Team and Contributors
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { describe, it } from "mocha";

import { assert } from "chai";

import { Suite, Test } from "../index";

describe("test with timeout", function() {
    let events: string[];

    @Suite()
    class TestWithTimeoutSuite {
        @Test({ timeout: 1000 })
        async test() {
            return new Promise((resolve) => {
                setTimeout(() => {
                    events.push("TestWithTimeoutSuite#test");
                    resolve(null);
                }, 50);
            });
        }
    }

    before(function() {
        events = [];
    });

    describe("the order of execution", function() {
        it("must be as expected", function() {
            assert.sameOrderedMembers(events, [
                "TestWithTimeoutSuite#test"
            ]);
        });
    });
});

describe("slow test", function() {
    let events: string[];

    @Suite()
    class SlowTestSuite {
        @Test({ slow: 50 })
        async test() {
            return new Promise((resolve) => {
                setTimeout(() => {
                    events.push("SlowTestSuite#test");
                    resolve(null);
                }, 100);
            });
        }
    }

    before(function() {
        events = [];
    });

    describe("the order of execution", function() {
        it("must be as expected", function() {
            assert.sameOrderedMembers(events, [
                "SlowTestSuite#test"
            ]);
        });
    });
});

describe("test with retries", function() {
    let events: string[];

    @Suite()
    class RetryTestSuite {
        retries = 0;

        @Test({ retry: 3 })
        test() {
            this.retries++;
            if (this.retries < 3) {
                events.push(`RetryTestSuite#test retry ${this.retries} failed`);
                throw new Error();
            }
            events.push(`RetryTestSuite#test retry ${this.retries} success`);
        }
    }

    before(function() {
        events = [];
    });

    describe("the order of execution", function() {
        it("must be as expected", function() {
            assert.sameOrderedMembers(events, [
                "RetryTestSuite#test retry 1 failed",
                "RetryTestSuite#test retry 2 failed",
                "RetryTestSuite#test retry 3 success"
            ]);
        });
    });
});
