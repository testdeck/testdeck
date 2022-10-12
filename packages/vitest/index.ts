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

import * as vitest from "vitest";

class VitestAdapter implements core.TestFrameworkAdapter {
  describe(options: core.EffectiveSuiteOptions, callback: () => void): void {
    switch (options.execution) {
      case "immediate":
        vitest.describe(options.name, callback);
        break;
      case "focus":
        core.withCondition(options.condition, () => {
          vitest.describe.only(options.name, callback);
        }, () => {
          vitest.describe(options.name, callback);
        });
        break;
      case "skip":
      case "pending":
        core.withCondition(options.condition, () => {
          vitest.describe.skip(options.name, callback);
        }, () => {
          vitest.describe(options.name, callback);
        });
        break;
    }
  }

  it(options: core.EffectiveTestOptions, callback: () => core.PromiseOrVoid): void {
    const testOptions: vitest.TestOptions = {
      timeout: options.timeout,
      retry: options.retry
    };
    switch (options.execution) {
      case "immediate":
        vitest.it(options.name, callback, testOptions);
        break;
      case "focus":
        core.withCondition(options.condition, () => {
          vitest.it.only(options.name, callback, testOptions);
        }, () => {
          vitest.it(options.name, callback, testOptions);
        });
        break;
      case "skip":
      case "pending":
        core.withCondition(options.condition, () => {
          vitest.it.skip(options.name, callback, testOptions);
        }, () => {
          vitest.it(options.name, callback, testOptions);
        });
        break;
    }
  }

  beforeAll(options: core.EffectiveHookOptions, callback: () => core.PromiseOrVoid): void {
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    vitest.beforeAll(callback as vitest.HookListener<any[], vitest.HookCleanupCallback>, options.timeout);
  }

  beforeEach(options: core.EffectiveHookOptions, callback: () => core.PromiseOrVoid): void {
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    vitest.beforeEach(callback as vitest.HookListener<any[], vitest.HookCleanupCallback>, options.timeout);
  }

  afterEach(options: core.EffectiveHookOptions, callback: () => core.PromiseOrVoid): void {
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    vitest.afterEach(callback as vitest.HookListener<any[], void>, options.timeout);
  }

  afterAll(options: core.EffectiveHookOptions, callback: () => core.PromiseOrVoid): void {
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    vitest.afterAll(callback as vitest.HookListener<any[], void>, options.timeout);
  }
}

class VitestClassTestUI extends core.ClassTestUI { }

const testUI = new VitestClassTestUI(new VitestAdapter());

export const {
  Suite,
  Test,
  Params,
  Before,
  After
} = testUI;
