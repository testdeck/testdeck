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

import { LoggingClassTestUI } from "./util";

import { AFTER, BEFORE } from "../index";

describe("Suite with @Before and @After decorated static methods and instance methods", () => {
    const loggingClassTestUI: LoggingClassTestUI = new LoggingClassTestUI();

    const {
        Suite,
        Before,
        After,
        Test
    } = loggingClassTestUI;

    @Suite()
    class SuiteWithMultipleBeforeAndAfterHooks {
        @Before()
        static beforeAll1() {
        }
        @Before()
        static beforeAll2() {
        }
        @After()
        static afterAll1() {
        }
        @After()
        static afterAll2() {
        }
        @Before()
        beforeEach1() {
        }
        @Before()
        beforeEach2() {
        }
        @After()
        afterEach1() {
        }
        @After()
        afterEach2() {
        }
        @Test()
        test() {
        }
    }

    it("everything is declared, registered and executed in the correct order", () => {
        assert.deepEqual(loggingClassTestUI.loggingAdapter.suite, {
            suiteSymbolIsSet: true,
            inheritanceWasPrevented: false,
            describeWasCalled: true,
            constructorWasCalled: true,
            userOptions: {},
            effectiveOptions: {
                execution: "immediate",
                name: "SuiteWithMultipleBeforeAndAfterHooks"
            },
            children: [
                {
                    hookSymbolWasSet: true,
                    hookWasRegisteredWith: "beforeEach",
                    isStaticHook: false,
                    kind: BEFORE,
                    methodWasCalled: true,
                    userOptions: {},
                    effectiveOptions: {
                        name: "SuiteWithMultipleBeforeAndAfterHooks#beforeEach1"
                    },
                    name: "SuiteWithMultipleBeforeAndAfterHooks#beforeEach1"
                },
                {
                    hookSymbolWasSet: true,
                    hookWasRegisteredWith: "beforeEach",
                    isStaticHook: false,
                    kind: BEFORE,
                    methodWasCalled: true,
                    userOptions: {},
                    effectiveOptions: {
                        name: "SuiteWithMultipleBeforeAndAfterHooks#beforeEach2"
                    },
                    name: "SuiteWithMultipleBeforeAndAfterHooks#beforeEach2"
                },
                {
                    hookSymbolWasSet: true,
                    hookWasRegisteredWith: "afterEach",
                    isStaticHook: false,
                    kind: AFTER,
                    methodWasCalled: true,
                    userOptions: {},
                    effectiveOptions: {
                        name: "SuiteWithMultipleBeforeAndAfterHooks#afterEach1"
                    },
                    name: "SuiteWithMultipleBeforeAndAfterHooks#afterEach1"
                },
                {
                    hookSymbolWasSet: true,
                    hookWasRegisteredWith: "afterEach",
                    isStaticHook: false,
                    kind: AFTER,
                    methodWasCalled: true,
                    userOptions: {},
                    effectiveOptions: {
                        name: "SuiteWithMultipleBeforeAndAfterHooks#afterEach2"
                    },
                    name: "SuiteWithMultipleBeforeAndAfterHooks#afterEach2"
                },
                {
                    testSymbolIsSet: true,
                    itWasCalled: true,
                    methodWasCalled: true,
                    userOptions: {},
                    effectiveOptions: {
                        execution: "immediate",
                        name: "test"
                    },
                    paramsSymbolIsSet: false,
                    params: [],
                    parameterizedInstances: [],
                    name: "test"
                },
                {
                    hookSymbolWasSet: true,
                    hookWasRegisteredWith: "beforeAll",
                    isStaticHook: true,
                    kind: BEFORE,
                    methodWasCalled: true,
                    userOptions: {},
                    effectiveOptions: {
                        name: "SuiteWithMultipleBeforeAndAfterHooks.beforeAll1"
                    },
                    name: "SuiteWithMultipleBeforeAndAfterHooks.beforeAll1"
                },
                {
                    hookSymbolWasSet: true,
                    hookWasRegisteredWith: "beforeAll",
                    isStaticHook: true,
                    kind: BEFORE,
                    methodWasCalled: true,
                    userOptions: {},
                    effectiveOptions: {
                        name: "SuiteWithMultipleBeforeAndAfterHooks.beforeAll2"
                    },
                    name: "SuiteWithMultipleBeforeAndAfterHooks.beforeAll2"
                },
                {
                    hookSymbolWasSet: true,
                    hookWasRegisteredWith: "afterAll",
                    isStaticHook: true,
                    kind: AFTER,
                    methodWasCalled: true,
                    userOptions: {},
                    effectiveOptions: {
                        name: "SuiteWithMultipleBeforeAndAfterHooks.afterAll1"
                    },
                    name: "SuiteWithMultipleBeforeAndAfterHooks.afterAll1"
                },
                {
                    hookSymbolWasSet: true,
                    hookWasRegisteredWith: "afterAll",
                    isStaticHook: true,
                    kind: AFTER,
                    methodWasCalled: true,
                    userOptions: {},
                    effectiveOptions: {
                        name: "SuiteWithMultipleBeforeAndAfterHooks.afterAll2"
                    },
                    name: "SuiteWithMultipleBeforeAndAfterHooks.afterAll2"
                },
            ],
            childSuites: [],
            executionOrder: [
                "SuiteWithMultipleBeforeAndAfterHooks.beforeAll1",
                "SuiteWithMultipleBeforeAndAfterHooks.beforeAll2",
                "SuiteWithMultipleBeforeAndAfterHooks#beforeEach1",
                "SuiteWithMultipleBeforeAndAfterHooks#beforeEach2",
                "test",
                "SuiteWithMultipleBeforeAndAfterHooks#afterEach1",
                "SuiteWithMultipleBeforeAndAfterHooks#afterEach2",
                "SuiteWithMultipleBeforeAndAfterHooks.afterAll1",
                "SuiteWithMultipleBeforeAndAfterHooks.afterAll2"
            ]
        });
    });
});
