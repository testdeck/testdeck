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

import { After, Before, CONTEXT, Suite, Test } from "../index";

describe("for a simple test suite", function() {
    const events: string[] = [];

    @Suite()
    class SimpleTestSuite {

        constructor() {
            assert.isDefined(this[CONTEXT]);
            events.push("constructor");
        }

        @Before()
        static before() {
            assert.isDefined(this[CONTEXT]);
            events.push("Suite static before");
        }

        @Before()
        before() {
            assert.isDefined(this[CONTEXT]);
            events.push("Suite before");
        }

        @Test()
        test() {
            assert.isDefined(this[CONTEXT]);
            events.push("Suite test");
        }

        @After()
        after() {
            assert.isDefined(this[CONTEXT]);
            events.push("Suite after");
        }

        @After()
        static after() {
            assert.isDefined(this[CONTEXT]);
            events.push("Suite static after");
        }
    }

    // must put this into a separate suite as mocha will run the outer suite's tests first
    describe("the order of execution", function() {
        it("must be as expected", function() {
            assert.sameOrderedMembers(events, [
                "constructor",
                "Suite static before",
                "Suite before",
                "Suite test",
                "Suite after",
                "Suite static after"
            ]);
        });
    });
});

describe("for an inherited test suite", function() {
    const events: string[] = [];

    abstract class Root {
        @Before()
        static rootBeforeAll1() {
            assert.isDefined(this[CONTEXT]);
            events.push("Root.rootBeforeAll1");
        }
        @Before()
        static rootBeforeAll2() {
            assert.isDefined(this[CONTEXT]);
            events.push("Root.rootBeforeAll2");
        }
        @After()
        static rootAfterAll1() {
            assert.isDefined(this[CONTEXT]);
            events.push("Root.rootAfterAll1");
        }
        @After()
        static rootAfterAll2() {
            assert.isDefined(this[CONTEXT]);
            events.push("Root.rootAfterAll2");
        }
        @Before()
        rootBeforeEach1() {
            assert.isDefined(this[CONTEXT]);
            events.push("Root#rootBeforeEach1");
        }
        @Before()
        rootBeforeEach2() {
            assert.isDefined(this[CONTEXT]);
            events.push("Root#rootBeforeEach2");
        }
        @After()
        rootAfterEach1() {
            assert.isDefined(this[CONTEXT]);
            events.push("Root#rootAfterEach1");
        }
        @After()
        rootAfterEach2() {
            assert.isDefined(this[CONTEXT]);
            events.push("Root#rootAfterEach2");
        }
        @Test()
        rootTest() {
            assert.isDefined(this[CONTEXT]);
            events.push("Root#rootTest");
        }
    }

    class Base extends Root {
        @Before()
        static baseBeforeAll1() {
            assert.isDefined(this[CONTEXT]);
            events.push("Base.baseBeforeAll1");
        }
        @Before()
        static baseBeforeAll2() {
            assert.isDefined(this[CONTEXT]);
            events.push("Base.baseBeforeAll2");
        }
        @After()
        static baseAfterAll1() {
            assert.isDefined(this[CONTEXT]);
            events.push("Base.baseAfterAll1");
        }
        @After()
        static baseAfterAll2() {
            assert.isDefined(this[CONTEXT]);
            events.push("Base.baseAfterAll2");
        }
        @Before()
        baseBeforeEach1() {
            assert.isDefined(this[CONTEXT]);
            events.push("Base#baseBeforeEach1");
        }
        @Before()
        baseBeforeEach2() {
            assert.isDefined(this[CONTEXT]);
            events.push("Base#baseBeforeEach2");
        }
        @After()
        baseAfterEach1() {
            assert.isDefined(this[CONTEXT]);
            events.push("Base#baseAfterEach1");
        }
        @After()
        baseAfterEach2() {
            assert.isDefined(this[CONTEXT]);
            events.push("Base#baseAfterEach2");
        }
        @Test()
        baseTest() {
            assert.isDefined(this[CONTEXT]);
            events.push("Base#baseTest");
        }
    }

    @Suite()
    class InheritedTestSuite extends Base {
        constructor() {
            super();
            assert.isDefined(this[CONTEXT]);
            events.push("constructor");
        }

        @Before()
        static before1() {
            assert.isDefined(this[CONTEXT]);
            events.push("InheritedTestSuite.before1");
        }
        @Before()
        static before2() {
            assert.isDefined(this[CONTEXT]);
            events.push("InheritedTestSuite.before2");
        }
        @After()
        static afterAll1() {
            assert.isDefined(this[CONTEXT]);
            events.push("InheritedTestSuite.afterAll1");
        }
        @After()
        static afterAll2() {
            assert.isDefined(this[CONTEXT]);
            events.push("InheritedTestSuite.afterAll2");
        }
        @Before()
        beforeEach1() {
            assert.isDefined(this[CONTEXT]);
            events.push("InheritedTestSuite#beforeEach1");
        }
        @Before()
        beforeEach2() {
            assert.isDefined(this[CONTEXT]);
            events.push("InheritedTestSuite#beforeEach2");
        }
        @After()
        afterEach1() {
            assert.isDefined(this[CONTEXT]);
            events.push("InheritedTestSuite#afterEach1");
        }
        @After()
        afterEach2() {
            assert.isDefined(this[CONTEXT]);
            events.push("InheritedTestSuite#afterEach2");
        }
        @Test()
        test() {
            assert.isDefined(this[CONTEXT]);
            events.push("InheritedTestSuite#test");
        }
    }

    // must put this into a separate suite as mocha will run the outer suite's tests first
    describe("the order of execution", function() {
        it("must be as expected", function() {
            assert.sameOrderedMembers(events, [
                "constructor",

                "Root.rootBeforeAll1",
                "Root.rootBeforeAll2",
                "Base.baseBeforeAll1",
                "Base.baseBeforeAll2",
                "InheritedTestSuite.before1",
                "InheritedTestSuite.before2",

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
