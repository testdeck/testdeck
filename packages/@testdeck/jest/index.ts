import * as core from "@testdeck/core";

const jestRunner: core.TestRunner = {
    suite(name: string, callback: () => void, settings?: core.SuiteSettings): void {
    },
    test(name: string, callback: core.CallbackOptionallyAsync, settings?: core.TestSettings): void {
    },
    beforeAll(name: string, callback: core.CallbackOptionallyAsync, settings?: core.LifecycleSettings): void {
    },
    beforeEach(name: string, callback: core.CallbackOptionallyAsync, settings?: core.LifecycleSettings): void {
    },
    afterEach(name: string, callback: core.CallbackOptionallyAsync, settings?: core.LifecycleSettings): void {
    },
    afterAll(name: string, callback: core.CallbackOptionallyAsync, settings?: core.LifecycleSettings): void {
    }
};

class JestClassTestUI extends core.ClassTestUI {
    public constructor(runner: core.TestRunner = jestRunner) {
        super(runner);
    }
}

const jestDecorators = new JestClassTestUI();

export = jestDecorators;