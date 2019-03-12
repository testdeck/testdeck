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

describe("Decorators", function() {

    let ui: LoggingClassTestUI;
    beforeEach("create ui", function() {
        ui = new LoggingClassTestUI();
    });
    afterEach("clear ui", function() {
        ui = null;
    });

    it("Just @suite and @test", function() {

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
});
