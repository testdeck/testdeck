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

describe("for an inherited test suite", function() {
    let events: string[];

    abstract class Root {
        @Before()
        static rootBeforeAll1() {
            events.push("Root.rootBeforeAll1");
        }
        @Before()
        static rootBeforeAll2() {
            events.push("Root.rootBeforeAll2");
        }
        @After()
        static rootAfterAll1() {
            events.push("Root.rootAfterAll1");
        }
        @After()
        static rootAfterAll2() {
            events.push("Root.rootAfterAll2");
        }
        @Before()
        rootBeforeEach1() {
            events.push("Root#rootBeforeEach1");
        }
        @Before()
        rootBeforeEach2() {
            events.push("Root#rootBeforeEach2");
        }
        @After()
        rootAfterEach1() {
            events.push("Root#rootAfterEach1");
        }
        @After()
        rootAfterEach2() {
            events.push("Root#rootAfterEach2");
        }
        @Test()
        rootTest() {
            events.push("Root#rootTest");
        }
    }

    class Base extends Root {
        @Before()
        static baseBeforeAll1() {
            events.push("Base.baseBeforeAll1");
        }
        @Before()
        static baseBeforeAll2() {
            events.push("Base.baseBeforeAll2");
        }
        @After()
        static baseAfterAll1() {
            events.push("Base.baseAfterAll1");
        }
        @After()
        static baseAfterAll2() {
            events.push("Base.baseAfterAll2");
        }
        @Before()
        baseBeforeEach1() {
            events.push("Base#baseBeforeEach1");
        }
        @Before()
        baseBeforeEach2() {
            events.push("Base#baseBeforeEach2");
        }
        @After()
        baseAfterEach1() {
            events.push("Base#baseAfterEach1");
        }
        @After()
        baseAfterEach2() {
            events.push("Base#baseAfterEach2");
        }
        @Test()
        baseTest() {
            events.push("Base#baseTest");
        }
    }

    @Suite()
    class InheritedTestSuite extends Base {
        @Before()
        static beforeAll1() {
            events.push("InheritedTestSuite.beforeAll1");
        }
        @Before()
        static beforeAll2() {
            events.push("InheritedTestSuite.beforeAll2");
        }
        @After()
        static afterAll1() {
            events.push("InheritedTestSuite.afterAll1");
        }
        @After()
        static afterAll2() {
            events.push("InheritedTestSuite.afterAll2");
        }
        @Before()
        beforeEach1() {
            events.push("InheritedTestSuite#beforeEach1");
        }
        @Before()
        beforeEach2() {
            events.push("InheritedTestSuite#beforeEach2");
        }
        @After()
        afterEach1() {
            events.push("InheritedTestSuite#afterEach1");
        }
        @After()
        afterEach2() {
            events.push("InheritedTestSuite#afterEach2");
        }
        @Test()
        test() {
            events.push("InheritedTestSuite#test");
        }
    }

    beforeAll(function() {
        events = [];
    });

    describe("the order of execution", function() {
        it("must be as expected", function() {
            expect(events).toEqual([
                "Root.rootBeforeAll1",
                "Root.rootBeforeAll2",
                "Base.baseBeforeAll1",
                "Base.baseBeforeAll2",
                "InheritedTestSuite.beforeAll1",
                "InheritedTestSuite.beforeAll2",

                "Root#rootBeforeEach1",
                "Root#rootBeforeEach2",
                "Base#baseBeforeEach1",
                "Base#baseBeforeEach2",
                "InheritedTestSuite#beforeEach1",
                "InheritedTestSuite#beforeEach2",
                "InheritedTestSuite#test",
                "InheritedTestSuite#afterEach1",
                "InheritedTestSuite#afterEach2",
                "Base#baseAfterEach1",
                "Base#baseAfterEach2",
                "Root#rootAfterEach1",
                "Root#rootAfterEach2",

                "Root#rootBeforeEach1",
                "Root#rootBeforeEach2",
                "Base#baseBeforeEach1",
                "Base#baseBeforeEach2",
                "InheritedTestSuite#beforeEach1",
                "InheritedTestSuite#beforeEach2",
                "Base#baseTest",
                "InheritedTestSuite#afterEach1",
                "InheritedTestSuite#afterEach2",
                "Base#baseAfterEach1",
                "Base#baseAfterEach2",
                "Root#rootAfterEach1",
                "Root#rootAfterEach2",

                "Root#rootBeforeEach1",
                "Root#rootBeforeEach2",
                "Base#baseBeforeEach1",
                "Base#baseBeforeEach2",
                "InheritedTestSuite#beforeEach1",
                "InheritedTestSuite#beforeEach2",
                "Root#rootTest",
                "InheritedTestSuite#afterEach1",
                "InheritedTestSuite#afterEach2",
                "Base#baseAfterEach1",
                "Base#baseAfterEach2",
                "Root#rootAfterEach1",
                "Root#rootAfterEach2",

                "InheritedTestSuite.afterAll1",
                "InheritedTestSuite.afterAll2",
                "Base.baseAfterAll1",
                "Base.baseAfterAll2",
                "Root.rootAfterAll1",
                "Root.rootAfterAll2",
            ]);
        });
    });
});
