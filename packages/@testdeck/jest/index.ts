import * as core from "@testdeck/core";

const jestRunner: core.TestRunner = {
  suite(name: string, callback: () => void, settings?: core.SuiteSettings): void {
    // TODO: Push settings.timeout on the stack and pass it to each child test...
    switch (settings && settings.execution) {
      case "only":
        describe.only(name, callback);
        break;
      case "skip":
        describe.skip(name, callback);
        break;
      case "pending":
        // `describe(name);` will not generate pending suite, intentionally skip.
        describe.skip(name, callback);
        break;
      default:
        describe(name, callback);
    }
  },
  test(name: string, callback: core.CallbackOptionallyAsync, settings?: core.TestSettings): void {
    // TODO: settings.timeout pass as last parameter to the it...
    switch (settings && settings.execution) {
      case "only":
        it.only(name, callback);
        break;
      case "skip":
        it.skip(name, callback);
        break;
      case "pending":
        it.todo(name);
        break;
      default:
        it(name, callback);
    }
  },
  beforeAll(name: string, callback: core.CallbackOptionallyAsync, settings?: core.LifecycleSettings): void {
    // TODO: timeout
    beforeAll(callback);
  },
  beforeEach(name: string, callback: core.CallbackOptionallyAsync, settings?: core.LifecycleSettings): void {
    // TODO: timeout
    beforeEach(callback);
  },
  afterEach(name: string, callback: core.CallbackOptionallyAsync, settings?: core.LifecycleSettings): void {
    // TODO: timeout
    afterEach(callback);
  },
  afterAll(name: string, callback: core.CallbackOptionallyAsync, settings?: core.LifecycleSettings): void {
    // TODO: timeout
    beforeAll(callback);
  }
};

class JestClassTestUI extends core.ClassTestUI {
  public constructor(runner: core.TestRunner = jestRunner) {
    super(runner);
  }
}

const jestDecorators = new JestClassTestUI();

export = jestDecorators;
