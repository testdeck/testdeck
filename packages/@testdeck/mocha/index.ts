import * as core from "@testdeck/core";

const mochaRunner: core.TestRunner<Mocha.Suite, Mocha.Context> = {
  declareSuite(name: string, cb: () => void) {
    describe(name, cb);
  },
  declareSuiteOnly(name: string, cb: () => void) {
    describe.only(name, cb);
  },
  declareSuiteSkip(name: string, cb: () => void) {
    describe.skip(name, cb);
  },
  declareSuitePending(name: string, cb: () => void) {
    describe.skip(name, cb);
  },

  declareTest(name: string, cb: core.MaybeAsyncCallback) {
    it(name, cb);
  },
  declareTestSkip(name: string, cb: core.MaybeAsyncCallback) {
    it.skip(name, cb);
  },
  declareTestPending(name: string) {
    it(name);
  },

  declareBeforeAll(cb: core.MaybeAsyncCallback) {
    before(cb);
  },
  declareBeforeEach(cb: core.MaybeAsyncCallback) {
    beforeEach(cb);
  },
  declareAfterAll(cb: core.MaybeAsyncCallback) {
    after(cb);
  },
  declareAfterEach(cb: core.MaybeAsyncCallback) {
    afterEach(cb);
  },

  setSlow(context: Mocha.Suite | Mocha.Context, ms: number) {
    context.slow(ms);
  },
  setTimeout(context: Mocha.Suite | Mocha.Context, ms: number) {
    context.timeout(ms);
  },
  setRetries(context: Mocha.Suite | Mocha.Context, attempts: number) {
    context.retries(attempts);
  }
};

class MochaClassTestUI extends core.ClassTestUI<Mocha.Suite, Mocha.Context> {

  private static readonly skipAllSymbol = core.ClassTestUI.MakeSymbol("skipAll");

  public readonly skipOnError: core.SuiteTrait<Mocha.Suite>;

  public constructor(runner: core.TestRunner<Mocha.Suite, Mocha.Context> = mochaRunner) {
    super(runner);

    // TODO: This is so tricky! There is a chance that only mocha's context will allow setting skip() when tests are in progress...
    this.skipOnError = this.trait(function(ctx, ctor) {
      ctx.beforeEach(function(this: Mocha.Context) {
        if (ctor[MochaClassTestUI.skipAllSymbol as any]) {
          this.skip();
        }
      });
      ctx.afterEach(function() {
        if (this.currentTest.state === "failed") {
          ctor[MochaClassTestUI.skipAllSymbol as any] = true;
        }
      });
    });
  }
}

const mochaDecorators = new MochaClassTestUI();

export = mochaDecorators;
