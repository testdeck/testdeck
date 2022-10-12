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

describe("Inherited suite with @Before and @After decorated static methods and instance methods", () => {
    const loggingClassTestUI: LoggingClassTestUI = new LoggingClassTestUI();

    const {
        Suite,
        Before,
        After,
        Test
    } = loggingClassTestUI;

    abstract class Root {
        @Before()
        static rootBeforeAll1() {
        }
        @Before()
        static rootBeforeAll2() {
        }
        @After()
        static rootAfterAll1() {
        }
        @After()
        static rootAfterAll2() {
        }
        @Before()
        rootBeforeEach1() {
        }
        @Before()
        rootBeforeEach2() {
        }
        @After()
        rootAfterEach1() {
        }
        @After()
        rootAfterEach2() {
        }
        @Test()
        rootTest() {
        }
    }

    class Base extends Root {
        @Before()
        static baseBeforeAll1() {
        }
        @Before()
        static baseBeforeAll2() {
        }
        @After()
        static baseAfterAll1() {
        }
        @After()
        static baseAfterAll2() {
        }
        @Before()
        baseBeforeEach1() {
        }
        @Before()
        baseBeforeEach2() {
        }
        @After()
        baseAfterEach1() {
        }
        @After()
        baseAfterEach2() {
        }
        @Test()
        baseTest() {
        }
    }

    @Suite()
    class SuiteWithMultipleBeforeAndAfterHooks extends Base {
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
                        name: "Root#rootBeforeEach1"
                    },
                    name: "Root#rootBeforeEach1"
                },
                {
                    hookSymbolWasSet: true,
                    hookWasRegisteredWith: "beforeEach",
                    isStaticHook: false,
                    kind: BEFORE,
                    methodWasCalled: true,
                    userOptions: {},
                    effectiveOptions: {
                        name: "Root#rootBeforeEach2"
                    },
                    name: "Root#rootBeforeEach2"
                },
                {
                    hookSymbolWasSet: true,
                    hookWasRegisteredWith: "afterEach",
                    isStaticHook: false,
                    kind: AFTER,
                    methodWasCalled: true,
                    userOptions: {},
                    effectiveOptions: {
                        name: "Root#rootAfterEach1"
                    },
                    name: "Root#rootAfterEach1"
                },
                {
                    hookSymbolWasSet: true,
                    hookWasRegisteredWith: "afterEach",
                    isStaticHook: false,
                    kind: AFTER,
                    methodWasCalled: true,
                    userOptions: {},
                    effectiveOptions: {
                        name: "Root#rootAfterEach2"
                    },
                    name: "Root#rootAfterEach2"
                },
                {
                    testSymbolIsSet: true,
                    itWasCalled: true,
                    methodWasCalled: true,
                    userOptions: {},
                    effectiveOptions: {
                        execution: "immediate",
                        name: "rootTest"
                    },
                    paramsSymbolIsSet: false,
                    params: [],
                    parameterizedInstances: [],
                    name: "rootTest"
                },
                {
                    hookSymbolWasSet: true,
                    hookWasRegisteredWith: "beforeAll",
                    isStaticHook: true,
                    kind: BEFORE,
                    methodWasCalled: true,
                    userOptions: {},
                    effectiveOptions: {
                        name: "Root.rootBeforeAll1"
                    },
                    name: "Root.rootBeforeAll1"
                },
                {
                    hookSymbolWasSet: true,
                    hookWasRegisteredWith: "beforeAll",
                    isStaticHook: true,
                    kind: BEFORE,
                    methodWasCalled: true,
                    userOptions: {},
                    effectiveOptions: {
                        name: "Root.rootBeforeAll2"
                    },
                    name: "Root.rootBeforeAll2"
                },
                {
                    hookSymbolWasSet: true,
                    hookWasRegisteredWith: "afterAll",
                    isStaticHook: true,
                    kind: AFTER,
                    methodWasCalled: true,
                    userOptions: {},
                    effectiveOptions: {
                        name: "Root.rootAfterAll1"
                    },
                    name: "Root.rootAfterAll1"
                },
                {
                    hookSymbolWasSet: true,
                    hookWasRegisteredWith: "afterAll",
                    isStaticHook: true,
                    kind: AFTER,
                    methodWasCalled: true,
                    userOptions: {},
                    effectiveOptions: {
                        name: "Root.rootAfterAll2"
                    },
                    name: "Root.rootAfterAll2"
                },
                {
                    hookSymbolWasSet: true,
                    hookWasRegisteredWith: "beforeEach",
                    isStaticHook: false,
                    kind: BEFORE,
                    methodWasCalled: true,
                    userOptions: {},
                    effectiveOptions: {
                        name: "Base#baseBeforeEach1"
                    },
                    name: "Base#baseBeforeEach1"
                },
                {
                    hookSymbolWasSet: true,
                    hookWasRegisteredWith: "beforeEach",
                    isStaticHook: false,
                    kind: BEFORE,
                    methodWasCalled: true,
                    userOptions: {},
                    effectiveOptions: {
                        name: "Base#baseBeforeEach2"
                    },
                    name: "Base#baseBeforeEach2"
                },
                {
                    hookSymbolWasSet: true,
                    hookWasRegisteredWith: "afterEach",
                    isStaticHook: false,
                    kind: AFTER,
                    methodWasCalled: true,
                    userOptions: {},
                    effectiveOptions: {
                        name: "Base#baseAfterEach1"
                    },
                    name: "Base#baseAfterEach1"
                },
                {
                    hookSymbolWasSet: true,
                    hookWasRegisteredWith: "afterEach",
                    isStaticHook: false,
                    kind: AFTER,
                    methodWasCalled: true,
                    userOptions: {},
                    effectiveOptions: {
                        name: "Base#baseAfterEach2"
                    },
                    name: "Base#baseAfterEach2"
                },
                {
                    testSymbolIsSet: true,
                    itWasCalled: true,
                    methodWasCalled: true,
                    userOptions: {},
                    effectiveOptions: {
                        execution: "immediate",
                        name: "baseTest"
                    },
                    paramsSymbolIsSet: false,
                    params: [],
                    parameterizedInstances: [],
                    name: "baseTest"
                },
                {
                    hookSymbolWasSet: true,
                    hookWasRegisteredWith: "beforeAll",
                    isStaticHook: true,
                    kind: BEFORE,
                    methodWasCalled: true,
                    userOptions: {},
                    effectiveOptions: {
                        name: "Base.baseBeforeAll1"
                    },
                    name: "Base.baseBeforeAll1"
                },
                {
                    hookSymbolWasSet: true,
                    hookWasRegisteredWith: "beforeAll",
                    isStaticHook: true,
                    kind: BEFORE,
                    methodWasCalled: true,
                    userOptions: {},
                    effectiveOptions: {
                        name: "Base.baseBeforeAll2"
                    },
                    name: "Base.baseBeforeAll2"
                },
                {
                    hookSymbolWasSet: true,
                    hookWasRegisteredWith: "afterAll",
                    isStaticHook: true,
                    kind: AFTER,
                    methodWasCalled: true,
                    userOptions: {},
                    effectiveOptions: {
                        name: "Base.baseAfterAll1"
                    },
                    name: "Base.baseAfterAll1"
                },
                {
                    hookSymbolWasSet: true,
                    hookWasRegisteredWith: "afterAll",
                    isStaticHook: true,
                    kind: AFTER,
                    methodWasCalled: true,
                    userOptions: {},
                    effectiveOptions: {
                        name: "Base.baseAfterAll2"
                    },
                    name: "Base.baseAfterAll2"
                },
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
                "Root.rootBeforeAll1",
                "Root.rootBeforeAll2",
                "Base.baseBeforeAll1",
                "Base.baseBeforeAll2",
                "SuiteWithMultipleBeforeAndAfterHooks.beforeAll1",
                "SuiteWithMultipleBeforeAndAfterHooks.beforeAll2",
                "Root#rootBeforeEach1",
                "Root#rootBeforeEach2",
                "Base#baseBeforeEach1",
                "Base#baseBeforeEach2",
                "SuiteWithMultipleBeforeAndAfterHooks#beforeEach1",
                "SuiteWithMultipleBeforeAndAfterHooks#beforeEach2",
                "test",
                "baseTest",
                "rootTest",
                "SuiteWithMultipleBeforeAndAfterHooks#afterEach1",
                "SuiteWithMultipleBeforeAndAfterHooks#afterEach2",
                "Base#baseAfterEach1",
                "Base#baseAfterEach2",
                "Root#rootAfterEach1",
                "Root#rootAfterEach2",
                "SuiteWithMultipleBeforeAndAfterHooks.afterAll1",
                "SuiteWithMultipleBeforeAndAfterHooks.afterAll2",
                "Base.baseAfterAll1",
                "Base.baseAfterAll2",
                "Root.rootAfterAll1",
                "Root.rootAfterAll2",
            ]
        });
    });
});

describe("suite inheriting from another suite must be prevented", function() {
    const loggingClassTestUI1: LoggingClassTestUI = new LoggingClassTestUI();
    const loggingClassTestUI2: LoggingClassTestUI = new LoggingClassTestUI();

    @loggingClassTestUI1.Suite()
    class FirstSuite {
    }

    @loggingClassTestUI2.Suite()
    class SecondSuite extends FirstSuite {
    }

    it("everything is declared, registered and executed in the correct order", () => {
        assert.deepEqual(loggingClassTestUI1.loggingAdapter.suite, {
            suiteSymbolIsSet: true,
            inheritanceWasPrevented: false,
            describeWasCalled: true,
            constructorWasCalled: true,
            userOptions: {},
            effectiveOptions: {
                execution: "immediate",
                name: "FirstSuite"
            },
            children: [],
            childSuites: [],
            executionOrder: []
        }, "FirstSuite");
        assert.deepEqual(loggingClassTestUI2.loggingAdapter.suite, {
            suiteSymbolIsSet: false,
            inheritanceWasPrevented: true,
            describeWasCalled: false,
            constructorWasCalled: false,
            userOptions: {},
            effectiveOptions: {},
            children: [],
            childSuites: [],
            executionOrder: []
        }, "SecondSuite");
    });
});

describe("inherited suite with test decorated with multiple @Params", function() {
    const loggingClassTestUI: LoggingClassTestUI = new LoggingClassTestUI();

    const parameterizedInvocations: unknown[] = [];

    const {
        Suite,
        Params,
        Test
    } = loggingClassTestUI;

    function parameterNameGenerator(params: number[]): string {
        return `base test ${params[0]} - ${params[1]} - ${params[2]} - ${params[3]}`;
    }

    class Base {
        @Test()
        @Params([9, 10, 11, 12], { name: "baseTest-9-10-11-12" })
        @Params([13, 14, 15, 16], { name: parameterNameGenerator })
        baseTest(params: []) {
            parameterizedInvocations.push(params);
        }
    }

    @Suite()
    class ParametizedTestSuite extends Base {
        @Test()
        @Params([1, 2, 3, 4])
        @Params([5, 6, 7, 8])
        test(params: []) {
            parameterizedInvocations.push(params);
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
                name: "ParametizedTestSuite"
            },
            children: [
                {
                    testSymbolIsSet: true,
                    itWasCalled: false,
                    methodWasCalled: false,
                    userOptions: {},
                    effectiveOptions: {
                        execution: "immediate",
                        name: "baseTest"
                    },
                    paramsSymbolIsSet: true,
                    params: [
                        {
                            params: [9, 10, 11, 12],
                            options: {
                                name: "baseTest-9-10-11-12"
                            }
                        },
                        {
                            params: [13, 14, 15, 16],
                            options: {
                                name: parameterNameGenerator
                            }
                        }
                    ],
                    parameterizedInstances: [
                        {
                            methodWasCalled: true,
                            itWasCalled: true,
                            name: "baseTest-9-10-11-12"
                        },
                        {
                            methodWasCalled: true,
                            itWasCalled: true,
                            name: "base test 13 - 14 - 15 - 16"
                        }
                    ],
                    name: "baseTest"
                },
                {
                    testSymbolIsSet: true,
                    itWasCalled: false,
                    methodWasCalled: false,
                    userOptions: {},
                    effectiveOptions: {
                        execution: "immediate",
                        name: "test"
                    },
                    paramsSymbolIsSet: true,
                    params: [
                        {
                            params: [1, 2, 3, 4],
                            options: {}
                        },
                        {
                            params: [5, 6, 7, 8],
                            options: {}
                        }
                    ],
                    parameterizedInstances: [
                        {
                            methodWasCalled: true,
                            itWasCalled: true,
                            name: "test 0"
                        },
                        {
                            methodWasCalled: true,
                            itWasCalled: true,
                            name: "test 1"
                        }
                    ],
                    name: "test"
                }
            ],
            childSuites: [
                "test",
                "baseTest"
            ],
            executionOrder: [
                "test 0",
                "test 1",
                "baseTest-9-10-11-12",
                "base test 13 - 14 - 15 - 16",
            ]
        }, "ParamerizedTestSuite");
        assert.deepEqual(parameterizedInvocations, [
            [1, 2, 3, 4],
            [5, 6, 7, 8],
            [9, 10, 11, 12],
            [13, 14, 15, 16]
        ], "parameterizedInvocations");
    });
});
