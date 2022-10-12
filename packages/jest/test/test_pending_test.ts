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

import { Suite, Test } from "../index";

describe("for a suite with unconditional pending test", function() {
    let events: string[];

    @Suite()
    class UnconditionalPendingTestSuite {
        @Test.Pending()
        test() {
            events.push("UnconditionalPendingTestSuite#test");
        }
    }

    beforeAll(function() {
        events = [];
    });

    describe("the order of execution", function() {
        it("must be as expected", function() {
            expect(events).toEqual([]);
        });
    });
});

describe("for a suite with conditional pending test", function() {
    let events: string[];

    @Suite()
    class ConditionalPendingTestSuite {
        @Test.Pending({ condition: true })
        test() {
            events.push("ConditionalPendingTestSuite#test");
        }
    }

    beforeAll(function() {
        events = [];
    });

    describe("the order of execution", function() {
        it("must be as expected", function() {
            expect(events).toEqual([]);
        });
    });
});

describe("for a suite with conditional non-pending test", function() {
    let events: string[];

    @Suite()
    class ConditionalNonPendingTestSuite {
        @Test.Pending({ condition: false })
        test() {
            events.push("ConditionalNonPendingTestSuite#test");
        }
    }

    beforeAll(function() {
        events = [];
    });

    describe("the order of execution", function() {
        it("must be as expected", function() {
            expect(events).toEqual([
                "ConditionalNonPendingTestSuite#test"
            ]);
        });
    });
});
