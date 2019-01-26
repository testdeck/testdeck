import { assert } from "chai";
import { params, suite } from "../../../index";

@suite
class ParamsSkipSuite {

  @params.skip({ a: "a", b: "b" }, "skipped")
  @params({ a: "a", b: "b" }, "not skipped")
  public "parameterised test skipping individual params"({ a, b }) {

    assert.equal("a", a, "a === 'a'");
    assert.equal("b", b, "b === 'b'");
  }
}
