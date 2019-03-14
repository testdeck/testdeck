import { assert } from "chai";
import {
    ClassTestUI,
    SuiteSettings,
    CallbackOptionallyAsync,
    TestSettings,
    LifecycleSettings,
    Done
} from "./index";

class LoggingClassTestUI extends ClassTestUI {
    public log: LoggingClassTestUI.Log;
    private readonly logger: LoggingClassTestUI.LoggingRunner;
    constructor() {
        const runner = new LoggingClassTestUI.LoggingRunner();
        super(runner);
        this.log = LoggingClassTestUI.Log.Default;
        runner.ui = this;
        this.logger = runner;
    }
    get root(): LoggingClassTestUI.ChildInfo[] { return this.logger.peek; }
}

module LoggingClassTestUI {
    export interface LifecycleInfo {
        type: "beforeAll" | "afterAll" | "beforeEach" | "afterEach";
        name: string;
        callback?: CallbackOptionallyAsync;
        settings?: LifecycleSettings;
    }

    export interface TestInfo {
        type: "test";
        name: string;
        callback?: CallbackOptionallyAsync;
        settings?: TestSettings;
    }

    export interface SuiteInfo {
        type: "suite";
        name: string;
        callback?: () => void;
        settings?: SuiteSettings;
        children: ChildInfo[];
    }

    export type ChildInfo = SuiteInfo | TestInfo | LifecycleInfo;

    export class LoggingRunner {
        public ui: LoggingClassTestUI;
        public stack: ChildInfo[][] = [[]];

        get peek(): ChildInfo[] { return this.stack[this.stack.length - 1]; }

        suite(name: string, callback: () => void, settings?: SuiteSettings) {
            const suite: SuiteInfo = { type: "suite", name, children: [] };
            if (settings) suite.settings = settings;
            if (this.ui.log & LoggingClassTestUI.Log.Callback) suite.callback = callback;
            this.peek.push(suite);
            this.stack.push(suite.children);
            try {
                callback();
            } finally {
                this.stack.pop();
            }
        }
        test(name: string, callback: CallbackOptionallyAsync, settings?: TestSettings) {
            const test: TestInfo = { type: "test", name };
            if (settings) test.settings = settings;
            if (this.ui.log & LoggingClassTestUI.Log.Callback) test.callback = callback;
            this.peek.push(test);
            try {
                callback();
            } finally {
            }
        }
        beforeAll(name: string, callback: CallbackOptionallyAsync, settings: LifecycleSettings) {
            const before: ChildInfo = { type: "beforeAll", name };
            if (settings) before.settings = settings;
            if (this.ui.log & LoggingClassTestUI.Log.Callback) before.callback = callback;
            this.peek.push(before);
        }
        beforeEach(name: string, callback: CallbackOptionallyAsync, settings: LifecycleSettings) {
            if (name == "setup instance" && !(this.ui.log & LoggingClassTestUI.Log.SetupTeardown)) return;
            const before: ChildInfo = { type: "beforeEach", name };
            if (settings) before.settings = settings;
            if (this.ui.log & LoggingClassTestUI.Log.Callback) before.callback = callback;
            this.peek.push(before);
        }
        afterEach(name: string, callback: CallbackOptionallyAsync, settings: LifecycleSettings) {
            if (name == "teardown instance" && !(this.ui.log & LoggingClassTestUI.Log.SetupTeardown)) return;
            const after: ChildInfo = { type: "afterEach", name };
            if (settings) after.settings = settings;
            if (this.ui.log & LoggingClassTestUI.Log.Callback) after.callback = callback;
            this.peek.push(after);
        }
        afterAll(name: string, callback: CallbackOptionallyAsync, settings: LifecycleSettings) {
            const after: ChildInfo = { type: "afterAll", name };
            if (settings) after.settings = settings;
            if (this.ui.log & LoggingClassTestUI.Log.Callback) after.callback = callback;
            this.peek.push(after);
        }
    }

    export const enum Log {
        Default = 0,
        SetupTeardown = 1,
        Callback = 2,
        All = SetupTeardown | Callback
    }
}

describe("decorators", function() {

    let ui: LoggingClassTestUI;
    beforeEach("create ui", function() {
        ui = new LoggingClassTestUI();
    });
    afterEach("clear ui", function() {
        ui = null;
    });

    // TODO: `suite("s", () => { it("t", () => {})});`
    it("functional usage");

    it("plain @suite and @test", function() {

        @ui.suite class SimpleSuite {
            @ui.test simpleTest() {}
        }

        assert.deepEqual(ui.root, [{
            "type": "suite",
            "name": "SimpleSuite",
            "children": [{
                "type": "test",
                "name": "simpleTest",
            }]
        }]);

    });

    it("execution modifier and settings combo", function() {

        @ui.suite(ui.slow(10), ui.timeout(20), ui.retries(3))
        class SuiteWithTimeouts {
            @ui.test(ui.slow(20), ui.timeout(40), ui.retries(5))
            test1() {}
            @ui.test
            test2() {}
            @ui.test(ui.skip)
            test3() {}
        }

        @ui.suite
        @ui.slow(10)
        @ui.timeout(20)
        @ui.retries(3)
        class SuiteWithTimeoutsAsDecorators {
            @ui.test
            @ui.slow(5)
            @ui.skip
            test1() {}

            @ui.test(ui.timeout(10))
            @ui.skip(true)
            test2() {}

            @ui.test(ui.retries(2))
            @ui.skip(false)
            test3() {}
        }

        @ui.suite
        @ui.only
        class SuiteOnlyThis {
            @ui.test
            test1() {}
        }

        assert.deepEqual(ui.root, [{
            "type": "suite",
            "name": "SuiteWithTimeouts",
            "settings": {
                "slow": 10,
                "timeout": 20,
                "retries": 3
            },
            "children": [{
                "type": "test",
                "name": "test1",
                "settings": {
                    "slow": 20,
                    "timeout": 40,
                    "retries": 5
                }
            }, {
                "type": "test",
                "name": "test2"
            }, {
                "type": "test",
                "name": "test3",
                "settings": {
                    "execution": "skip"
                }
            }]
        }, {
            "type": "suite",
            "name": "SuiteWithTimeoutsAsDecorators",
            "settings": {
                "slow": 10,
                "timeout": 20,
                "retries": 3
            },
            "children": [{
                "type": "test",
                "name": "test1",
                "settings": {
                    "slow": 5,
                    "execution": "skip"
                }
            }, {
                "type": "test",
                "name": "test2",
                "settings": {
                    "timeout": 10,
                    "execution": "skip"
                }
            }, {
                "type": "test",
                "name": "test3",
                "settings": {
                    "retries": 2
                }
            }]
        }, {
            "type": "suite",
            "name": "SuiteOnlyThis",
            "settings": {
                "execution": "only"
            },
            "children": [{
                "type": "test",
                "name": "test1"
            }]
        }]);
    });

    it("before and after", function() {

        ui.log = LoggingClassTestUI.Log.SetupTeardown;

        @ui.suite class SomeSuite {
            static before() {}
            before() {}
            after() {}
            static after() {}
        }

        assert.deepEqual(ui.root,[{
            "type": "suite",
            "name": "SomeSuite",
            "children": [{
                "type": "beforeAll",
                "name": "static before"
            }, {
                "type": "beforeEach",
                "name": "setup instance"
            }, {
                "type": "beforeEach",
                "name": "before"
            }, {
                "type": "afterEach",
                "name": "after"
            }, {
                "type": "afterEach",
                "name": "teardown instance"
            }, {
                "type": "afterAll",
                "name": "static after"
            }]
        }]);
    });

    it("async done callbacks", function() {
        
        ui.log = LoggingClassTestUI.Log.Callback;

        @ui.suite class AllSync {
            static before() {}
            before() {}
            @ui.test test() {}
            after() {}
            static after() {}
        }

        @ui.suite class AllAsync {
            static before(done: Done) {}
            before(done: Done) {}
            @ui.test test(done: Done) {}
            after(done: Done) {}
            static after(done: Done) {}
        }

        assert.equal(ui.root.length, 2);
        const syncSuite = (ui.root[0] as LoggingClassTestUI.SuiteInfo);
        const asyncSuite = (ui.root[1] as LoggingClassTestUI.SuiteInfo);
        assert.equal(syncSuite.children.length, 5);
        assert.equal(asyncSuite.children.length, 5);
        syncSuite.children.forEach(child => assert.equal(child.callback.length, 0));
        asyncSuite.children.forEach(child => assert.equal(child.callback.length, 1));


        console.log(JSON.stringify(ui.root, null, "  "));
    });

    it("named suites and tests");
    it("params");
});

describe("lifecycle hooks", function() {
    it("instantiate on ctor and clean-up on dtor");
    it("instantiate through DI A/B");
});

declare var console;
