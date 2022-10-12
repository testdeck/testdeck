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

import { After, Before, Suite, Test } from "../index";

describe("for a simple test suite", function() {
    let events: string[];

    @Suite()
    class SimpleTestSuite {
        @Before()
        static before() {
            events.push("Suite static before");
        }

        @Before()
        before() {
            events.push("Suite before");
        }

        @Test()
        test() {
            events.push("Suite test");
        }

        @After()
        after() {
            events.push("Suite after");
        }

        @After()
        static after() {
            events.push("Suite static after");
        }
    }

    beforeAll(function() {
        events = [];
    });

    // must put this into a separate suite as mocha will run the outer suite's tests first
    it("order of execution must be as expected", function() {
        expect(events).toEqual([
            "Suite static before",
            "Suite before",
            "Suite test",
            "Suite after",
            "Suite static after"
        ]);
    });
});
