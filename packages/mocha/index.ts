import * as core from "@testdeck/core";

function applyTimings(fn: core.WithOptionalCallback, settings: core.LifecycleSettings): core.WithOptionalCallback {
    // FIXME this resolves to any (is it global this?)
    if (fn.length === 1) {
        return core.wrap(function(done) {
            if (settings.retries !== undefined) { this.retries(settings.retries); }
            if (settings.slow !== undefined) { this.slow(settings.slow); }
            if (settings.timeout !== undefined) { this.timeout(settings.timeout); }
            return fn.call(this, done);
        }, fn);
    } else {
        return core.wrap(function() {
            if (settings.retries !== undefined) { this.retries(settings.retries); }
            if (settings.slow !== undefined) { this.slow(settings.slow); }
            if (settings.timeout !== undefined) { this.timeout(settings.timeout); }
            return fn.call(this);
        }, fn);
    }
}

const mochaRunner: core.TestRunner = {
    suite(name: string, fn: () => void, settings?: core.LifecycleSettings): void {
        switch (settings.execution) {
            case "only":
                describe.only(name, applyTimings(fn, settings));
                break;
            case "skip":
                describe.skip(name, applyTimings(fn, settings));
                break;
            case "pending":
                // `describe(name);` will not generate pending suite, intentionally skip.
                describe.skip(name, applyTimings(fn, settings));
                break;
            default:
                describe(name, applyTimings(fn, settings));
        }
    },
    test(name: string, fn: core.WithOptionalCallback, settings?: core.LifecycleSettings): void {
        switch (settings.execution) {
            case "only":
                it.only(name, applyTimings(fn, settings));
                break;
            case "skip":
                it.skip(name, applyTimings(fn, settings));
                break;
            case "pending":
                it(name);
                break;
            default:
                it(name, applyTimings(fn, settings));
        }
    },

    beforeAll(name: string, fn: core.WithOptionalCallback, settings?: core.LifecycleSettings): void {
        before(applyTimings(fn, settings));
    },
    beforeEach(name: string, fn: core.WithOptionalCallback, settings?: core.LifecycleSettings): void {
        beforeEach(applyTimings(fn, settings));
    },
    afterEach(name: string, fn: core.WithOptionalCallback, settings?: core.LifecycleSettings): void {
        afterEach(applyTimings(fn, settings));
    },
    afterAll(name: string, fn: core.WithOptionalCallback, settings?: core.LifecycleSettings): void {
        after(applyTimings(fn, settings));
    }
};

class MochaClassTestUI extends core.ClassTestUI {
    // TODO: skipOnError, @context
    public constructor(runner: core.TestRunner = mochaRunner) {
        super(runner);
    }
}

const mochaDecorators = new MochaClassTestUI();

interface MochaClassTestUI {
    readonly context: unique symbol;
}

declare global {
    interface Function {
        [mochaDecorators.context]: Mocha.Suite;
    }
    interface Object {
        [mochaDecorators.context]: Mocha.Context
    }
}

export const {

    context,

    suite,
    test,
    slow,
    timeout,
    retries,
    pending,
    only,
    skip,
    params
} = mochaDecorators;

export { Done } from "@testdeck/core";
