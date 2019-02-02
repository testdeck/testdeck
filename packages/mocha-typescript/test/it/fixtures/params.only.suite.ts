import { assert } from "chai";
import { params, suite } from "../../../src/";

@suite
class ParamsOnlySuite {

  @params({ a: "a", b: "b" }, "must not be executed")
  @params.only({ a: "a", b: "b" }, "must be run 1")
  @params.only({ a: "a", b: "b" }, "must be run 2")
  @params({ a: "a", b: "b" }, "and another that must not be executed")
  public "parameterised test limiting tests to only specific params"({ a, b }) {

    assert.equal("a", a, "a === 'a'");
    assert.equal("b", b, "b === 'b'");
  }
}
