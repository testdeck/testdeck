import { assert } from "chai";
import {
    ClassTestUI,
    SuiteSettings,
    CallbackOptionallyAsync,
    TestSettings,
    LifecycleSettings
} from "./index";

class LoggingClassTestUI extends ClassTestUI {
    private readonly logger: LoggingClassTestUI.LoggingRunner;
    constructor() {
        const runner = new LoggingClassTestUI.LoggingRunner();
        super(runner);
        this.logger = runner;
    }
    get root(): (LoggingClassTestUI.SuiteInfo | LoggingClassTestUI.TestInfo)[] { return this.logger.peek; }
}

module LoggingClassTestUI {
    export interface TestInfo {
        type: "test",
        name: string,
        settings?: TestSettings;
    }

    export interface SuiteInfo {
        type: "suite";
        name: string;
        settings?: SuiteSettings;
        children: (SuiteInfo | TestInfo)[];
    }

    export class LoggingRunner {
        public ui: LoggingClassTestUI;
        public stack: (SuiteInfo | TestInfo)[][] = [[]];

        get peek(): (SuiteInfo | TestInfo)[] { return this.stack[this.stack.length - 1]; }

        suite(name: string, callback: () => void, settings?: SuiteSettings) {
            const suite: (SuiteInfo | TestInfo) = { type: "suite", name, children: [] };
            if (settings) suite.settings = settings;
            this.peek.push(suite);
            this.stack.push(suite.children);
            try {
                callback();
            } finally {
                this.stack.pop();
            }
        }
        test(name: string, callback: CallbackOptionallyAsync, settings?: TestSettings) {
            const test: (SuiteInfo | TestInfo) = { type: "test", name };
            if (settings) test.settings = settings;
            this.peek.push(test);
            try {
                callback();
            } finally {
            }
        }
        beforeAll(callback: CallbackOptionallyAsync, settings: LifecycleSettings) {
        }
        beforeEach(callback: CallbackOptionallyAsync, settings: LifecycleSettings) {
        }
        afterEach(callback: CallbackOptionallyAsync, settings: LifecycleSettings) {
        }
        afterAll(callback: CallbackOptionallyAsync, settings: LifecycleSettings) {
        }
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
});

declare var console;
