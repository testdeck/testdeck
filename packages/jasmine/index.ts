import * as core from "@testdeck/core";

const jasmineRunner: core.TestRunner = {
    suite(name: string, callback: () => void, settings?: core.SuiteSettings): void {
        switch (settings?.execution) {
            case "only":
                fdescribe(name, callback);
                break;
            case "skip":
                xdescribe(name, callback);
                break;
            case "pending":
                // No `describe(name);` nor `describe.peding`... Use skip.
                xdescribe(name, callback);
                break;
            default:
                describe(name, callback);
        }
    },
    test(name: string, callback: core.CallbackOptionallyAsync, settings?: core.TestSettings): void {
        switch (settings?.execution) {
            case "only":
                fit(name, callback, settings.timeout);
                break;
            case "skip":
                xit(name, callback, settings.timeout);
                break;
            case "pending":
                xit(name);
                break;
            default:
                it(name, callback, settings.timeout);
        }
    },
    beforeAll(name: string, callback: core.CallbackOptionallyAsync, settings?: core.LifecycleSettings): void {
        beforeAll(callback, settings?.timeout);
    },
    beforeEach(name: string, callback: core.CallbackOptionallyAsync, settings?: core.LifecycleSettings): void {
        beforeEach(callback, settings?.timeout);
    },
    afterEach(name: string, callback: core.CallbackOptionallyAsync, settings?: core.LifecycleSettings): void {
        afterEach(callback, settings?.timeout);
    },
    afterAll(name: string, callback: core.CallbackOptionallyAsync, settings?: core.LifecycleSettings): void {
        afterAll(callback, settings?.timeout);
    }
};

class JasmineClassTestUI extends core.ClassTestUI {
    public readonly executeAfterHooksInReverseOrder: boolean = true;

    public constructor(runner: core.TestRunner = jasmineRunner) {
        super(runner);
    }
}

const jasmineDecorators = new JasmineClassTestUI();

export const {

    // "context" is not available for jasmine

    suite,
    test,
    slow,
    timeout,
    retries,
    pending,
    only,
    skip,
    params
} = jasmineDecorators;

export { Done } from "@testdeck/core";
