// Copyright 2016-2022 Testdeck Team and Contributors
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import * as core from "@testdeck/core";

function applyTimings(fn: any, settings: any): any {
  if (settings) {
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
  } else {
    return fn;
  }
}

const mochaRunner: core.TestRunner = {
  suite(name: string, callback: () => void, settings?: core.SuiteSettings): void {
    switch (settings && settings.execution) {
      case "only":
        describe.only(name, applyTimings(callback, settings));
        break;
      case "skip":
        describe.skip(name, applyTimings(callback, settings));
        break;
      case "pending":
        // `describe(name);` will not generate pending suite, intentionally skip.
        describe.skip(name, applyTimings(callback, settings));
        break;
      default:
        describe(name, applyTimings(callback, settings));
    }
  },
  test(name: string, callback: core.CallbackOptionallyAsync, settings?: core.TestSettings): void {
    switch (settings && settings.execution) {
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

  beforeAll(name: string, callback: core.CallbackOptionallyAsync, settings?: core.LifecycleSettings): void {
    before(applyTimings(callback, settings));
  },
  beforeEach(name: string, callback: core.CallbackOptionallyAsync, settings?: core.LifecycleSettings): void {
    beforeEach(applyTimings(callback, settings));
  },
  afterEach(name: string, callback: core.CallbackOptionallyAsync, settings?: core.LifecycleSettings): void {
    afterEach(applyTimings(callback, settings));
  },
  afterAll(name: string, callback: core.CallbackOptionallyAsync, settings?: core.LifecycleSettings): void {
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
