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

import { before, describe, it } from "mocha";

import { assert } from "chai";

import { Suite, Test } from "../index";

describe("for a suite with conditional non-only test", function() {
    let events: string[];

    @Suite()
    class ConditionalNonFocusTestSuite {
        @Test.Focus({ condition: false })
        test() {
            events.push("ConditionalNonFocusTestSuite#test");
        }
    }

    before(function() {
        events = [];
    });

    describe("the order of execution", function() {
        it("must be as expected", function() {
            assert.sameOrderedMembers(events, [
                "ConditionalNonFocusTestSuite#test"
            ]);
        });
    });
});
