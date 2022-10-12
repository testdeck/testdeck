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

import { describe, it } from "mocha";

import { assert } from "chai";

import { withCondition } from '../index';

describe("withCondition", function() {
    it("must call onTrue on literal true", function() {
        withCondition(true, () => {
        }, () => {
            assert.fail("must not have been called");
        });
    });

    it("must call onFalse on literal false", function() {
        withCondition(false, () => {
            assert.fail("must not have been called");
        }, () => {
        });
    });

    it("must call onTrue on function returning true", function() {
        withCondition(() => true, () => {
        }, () => {
            assert.fail("must not have been called");
        });
    });

    it("must call onFalse on function returning false", function() {
        withCondition(() => false, () => {
            assert.fail("must not have been called");
        }, () => {
        });
    });
});
