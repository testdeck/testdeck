// Copyright 2022 Testdeck Team and Contributors
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import * as core from "@testdeck/core";

function applyTimings(options: core.ExecutionOptions, callback: () => Promise<unknown> | void): () => Promise<unknown> | void {
  return core.wrap(function(this: Mocha.Context): core.PromiseOrVoid {
    if (options.retry) {
      this.retries(options.retry);
    }
    if (options.timeout) {
      this.timeout(options.timeout);
    }
    if (options.slow) {
      this.slow(options.slow);
    }

    return (callback.bind(this) as () => core.PromiseOrVoid)();
  }, callback);
}

class MochaAdapter implements core.TestFrameworkAdapter {
  describe(options: core.EffectiveSuiteOptions, callback: () => void): void {
    switch (options.execution) {
      case "immediate":
        describe(options.name, callback);
        break;
      case "focus":
        core.withCondition(options.condition, () => {
          describe.only(options.name, callback);
        }, () => {
          describe(options.name, callback);
        });
        break;
      case "skip":
      case "pending":
        core.withCondition(options.condition, () => {
          describe.skip(options.name, callback);
        }, () => {
          describe(options.name, callback);
        });
        break;
    }
  }

  it(options: core.EffectiveTestOptions, callback: () => core.PromiseOrVoid): void {
    const actualCallback = applyTimings(options, callback);
    switch (options.execution) {
      case "immediate":
        it(options.name, actualCallback);
        break;
      case "focus":
        core.withCondition(options.condition, () => {
          it.only(options.name, actualCallback);
        }, () => {
          it(options.name, actualCallback);
        });
        break;
      case "skip":
      case "pending":
        core.withCondition(options.condition, () => {
          it.skip(options.name, actualCallback);
        }, () => {
          it(options.name, actualCallback);
        });
        break;
    }
  }

  beforeAll(options: core.EffectiveHookOptions, callback: () => core.PromiseOrVoid): void {
    const actualCallback = applyTimings({ timeout: options.timeout }, callback);
    before(actualCallback);
  }

  beforeEach(options: core.EffectiveHookOptions, callback: () => core.PromiseOrVoid): void {
    const actualCallback = applyTimings({ timeout: options.timeout }, callback);
    beforeEach(actualCallback);
  }

  afterEach(options: core.EffectiveHookOptions, callback: () => core.PromiseOrVoid): void {
    const actualCallback = applyTimings({ timeout: options.timeout }, callback);
    afterEach(actualCallback);
  }

  afterAll(options: core.EffectiveHookOptions, callback: () => core.PromiseOrVoid): void {
    const actualCallback = applyTimings({ timeout: options.timeout }, callback);
    after(actualCallback);
  }
}

class MochaClassTestUI extends core.ClassTestUI { }

const testUI = new MochaClassTestUI(new MochaAdapter());

export const {
  Suite,
  Test,
  Params,
  Before,
  After,
} = testUI;

export const CONTEXT = core.CONTEXT;

// declare global {
//   export interface Object {
//     [core.CONTEXT]: Context;
//   }
// }
