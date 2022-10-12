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

import { beforeAll, describe, it } from "vitest";

import { assert } from "chai";

import { Suite, Test } from "../../index";

describe("for a suite with unconditional only test", function() {
    let events: string[];

    @Suite()
    class UnconditionalFocusTestSuite {
        @Test.Focus()
        test() {
            events.push("UnconditionalFocusTestSuite#test");
        }
    }

    beforeAll(function() {
        events = [];
    });

    describe("the order of execution", function() {
        it("must be as expected", function() {
            assert.sameOrderedMembers(events, [
                "UnconditionalFocusTestSuite#test"
            ]);
        });
    });
});

describe("for a suite with conditional only test", function() {
    let events: string[];

    @Suite()
    class ConditionalFocusTestSuite {
        @Test.Focus({ condition: true })
        test() {
            events.push("ConditionalFocusTestSuite#test");
        }
    }

    beforeAll(function() {
        events = [];
    });

    describe("the order of execution", function() {
        it("must be as expected", function() {
            assert.sameOrderedMembers(events, [
                "ConditionalFocusTestSuite#test"
            ]);
        });
    });
});
