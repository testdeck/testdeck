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
        // No `describe(name);` nor `describe.todo`... Use skip.
        describe.skip(name, callback);
        break;
      default:
        describe(name, callback);
    }
  },
  test(name: string, callback: core.CallbackOptionallyAsync, settings?: core.TestSettings): void {
    switch (settings && settings.execution) {
      case "only":
        it.only(name, callback, settings && settings.timeout);
        break;
      case "skip":
        it.skip(name, callback, settings && settings.timeout);
        break;
      case "pending":
        it.todo(name);
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
