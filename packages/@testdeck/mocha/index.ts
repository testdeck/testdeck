import * as core from "@testdeck/core";

function applyTimings(fn: any, settings: any): any {
  if (fn.length === 1) {
    return core.wrap(function(done) {
      if (settings.retries !== undefined) this.retries(settings.retries);
      if (settings.slow !== undefined) this.slow(settings.slow);
      if (settings.timeout !== undefined) this.timeout(settings.timeout);
      return fn.call(this, done);
    }, fn);
  } else {
    return core.wrap(function() {
      if (settings.retries !== undefined) this.retries(settings.retries);
      if (settings.slow !== undefined) this.slow(settings.slow);
      if (settings.timeout !== undefined) this.timeout(settings.timeout);
      return fn.call(this);
    }, fn);
  }
}

const mochaRunner: core.TestRunner = {
  suite(name: string, callback: () => void, settings: core.SuiteSettings) {
    switch(settings.execution) {
      case "only":
        describe.only(name, applyTimings(callback, settings));
        break;
      case "skip":
        describe.skip(name, applyTimings(callback, settings));
        break;
      case "pending":
        describe(name);
        break;
      default:
        describe(name, applyTimings(callback, settings));
    }
  },
  test(name: string, callback: core.CallbackOptionallyAsync, settings: core.TestSettings) {
    switch(settings.execution) {
      case "only":
        it.only(name, applyTimings(callback, settings));
        break;
      case "skip":
        it.skip(name, applyTimings(callback, settings));
        break;
      case "pending":
        it(name);
        break;
      default:
        it(name, applyTimings(callback, settings));
    }
  },

  beforeAll(callback: core.CallbackOptionallyAsync, settings: core.LifecycleSettings) {
    before(applyTimings(callback, settings));
  },
  beforeEach(callback: core.CallbackOptionallyAsync, settings: core.LifecycleSettings) {
    beforeEach(applyTimings(callback, settings));
  },
  afterEach(callback: core.CallbackOptionallyAsync, settings: core.LifecycleSettings) {
    afterEach(applyTimings(callback, settings));
  },
  afterAll(callback: core.CallbackOptionallyAsync, settings: core.LifecycleSettings) {
    after(applyTimings(callback, settings));
  }
};

class MochaClassTestUI extends core.ClassTestUI {
  // TODO: skipOnError, @context
  public constructor(runner: core.TestRunner = mochaRunner) {
    super(runner);
  }
}

const mochaDecorators = new MochaClassTestUI();

export = mochaDecorators;
