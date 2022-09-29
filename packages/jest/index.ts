import * as core from "@testdeck/core";

// FIXME jestRunner does not apply required timeout/retries and so on...
const jestRunner: core.TestRunner = {
    suite(name: string, fn: () => void, settings?: core.LifecycleSettings): void {
        // TODO: Push settings.timeout on the stack and pass it to each child test...
        switch (settings.execution) {
            case "only":
                describe.only(name, fn);
                break;
            case "skip":
                describe.skip(name, fn);
                break;
            case "pending":
                // No `describe(name);` nor `describe.todo`... Use skip.
                describe.skip(name, fn);
                break;
            default:
                describe(name, fn);
        }
    },
    test(name: string, callback: core.WithOptionalCallback, settings?: core.LifecycleSettings): void {
        switch (settings.execution) {
            case "only":
                it.only(name, callback, settings.timeout);
                break;
            case "skip":
                it.skip(name, callback, settings.timeout);
                break;
            case "pending":
                it.todo(name);
                break;
            default:
                it(name, callback, settings.timeout);
        }
    },
    beforeAll(name: string, callback: core.CallbackOptionallyAsync, settings?: core.LifecycleSettings): void {
        beforeAll(callback, settings.timeout);
    },
    beforeEach(name: string, callback: core.CallbackOptionallyAsync, settings?: core.LifecycleSettings): void {
        beforeEach(callback, settings.timeout);
    },
    afterEach(name: string, callback: core.CallbackOptionallyAsync, settings?: core.LifecycleSettings): void {
        afterEach(callback, settings.timeout);
    },
    afterAll(name: string, callback: core.CallbackOptionallyAsync, settings?: core.LifecycleSettings): void {
        afterAll(callback, settings.timeout);
    }
};

class JestClassTestUI extends core.ClassTestUI {
    public constructor(runner: core.TestRunner = jestRunner) {
        super(runner);
    }
}

const jestDecorators = new JestClassTestUI();

export const {

    // "context" is not available for jest

    suite,
    test,
    slow,
    timeout,
    retries,
    pending,
    only,
    skip,
    params
} = jestDecorators;

export { Done } from "@testdeck/core";
