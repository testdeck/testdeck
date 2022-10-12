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

import { afterAll, afterEach, beforeAll, beforeEach, describe, it } from "@jest/globals";

import * as core from "@testdeck/core";

class JestAdapter implements core.TestFrameworkAdapter {
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

  it(options: core.EffectiveTestOptions, callback: () => Promise<unknown> | void): void {
    switch (options.execution) {
      case "immediate":
        it(options.name, callback, options.timeout);
        break;
      case "focus":
        core.withCondition(options.condition, () => {
          it.only(options.name, callback, options.timeout);
        }, () => {
          it(options.name, callback, options.timeout);
        });
        break;
      case "skip":
      case "pending":
        core.withCondition(options.condition, () => {
          it.skip(options.name, callback, options.timeout);
        }, () => {
          it(options.name, callback, options.timeout);
        });
        break;
    }
  }

  beforeAll(options: core.EffectiveHookOptions, callback: () => core.PromiseOrVoid): void {
    beforeAll(callback, options.timeout);
  }

  beforeEach(options: core.EffectiveHookOptions, callback: () => core.PromiseOrVoid): void {
    beforeEach(callback, options.timeout);
  }

  afterEach(options: core.EffectiveHookOptions, callback: () => core.PromiseOrVoid): void {
    afterEach(callback, options.timeout);
  }

  afterAll(options: core.EffectiveHookOptions, callback: () => core.PromiseOrVoid): void {
    afterAll(callback, options.timeout);
  }
}

class JestClassTestUI extends core.ClassTestUI { }

const testUI = new JestClassTestUI(new JestAdapter());

export const {
  Suite,
  Test,
  Params,
  Before,
  After
} = testUI;
