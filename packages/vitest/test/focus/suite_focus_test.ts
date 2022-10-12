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

describe("for an unconditional only suite", function() {
    let events: string[];

    @Suite.Focus()
    class UnconditionalFocusSuite {
        @Test()
        test() {
            events.push("UnconditionalFocusSuite#test");
        }
    }

    beforeAll(function() {
        events = [];
    });

    describe("the order of execution", function() {
        it("must be as expected", function() {
            assert.sameOrderedMembers(events, [
                "UnconditionalFocusSuite#test"
            ]);
        });
    });
});

describe("for a conditional only suite", function() {
    let events: string[];

    @Suite.Focus({ condition: true })
    class ConditionalFocusSuite {
        @Test()
        test() {
            events.push("ConditionalFocusSuite#test");
        }
    }

    beforeAll(function() {
        events = [];
    });

    describe("the order of execution", function() {
        it("must be as expected", function() {
            assert.sameOrderedMembers(events, [
                "ConditionalFocusSuite#test"
            ]);
        });
    });
});
