import * as core from "@testdeck/core";

const jestRunner: core.TestRunner = {
  suite(name: string, callback: () => void, settings?: core.SuiteSettings): void {
    // TODO: Push settings.timeout on the stack and pass it to each child test...
    switch (settings && settings.execution) {
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
    switch (settings && settings.execution) {
      case "only":
        fit(name, callback, settings && settings.timeout);
        break;
      case "skip":
        xit(name, callback, settings && settings.timeout);
        break;
      case "pending":
        xit(name);
        break;
      default:
        it(name, callback, settings && settings.timeout);
    }
  },
  beforeAll(name: string, callback: core.CallbackOptionallyAsync, settings?: core.LifecycleSettings): void {
    beforeAll(callback, settings && settings.timeout);
  },
  beforeEach(name: string, callback: core.CallbackOptionallyAsync, settings?: core.LifecycleSettings): void {
    beforeEach(callback, settings && settings.timeout);
  },
  afterEach(name: string, callback: core.CallbackOptionallyAsync, settings?: core.LifecycleSettings): void {
    afterEach(callback, settings && settings.timeout);
  },
  afterAll(name: string, callback: core.CallbackOptionallyAsync, settings?: core.LifecycleSettings): void {
    afterAll(callback, settings && settings.timeout);
  }
};

class JestClassTestUI extends core.ClassTestUI {
  public readonly executeAfterHooksInReverseOrder: boolean = true;

  public constructor(runner: core.TestRunner = jestRunner) {
    super(runner);
  }
}

const jestDecorators = new JestClassTestUI();

export = jestDecorators;
