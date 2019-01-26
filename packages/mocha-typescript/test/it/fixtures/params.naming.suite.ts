import { assert } from "chai";
import { params, suite } from "../../../index";

@suite
class ParamsNamingSuite {

  @params({ a: "a", b: "b" }, "naming override")
  @params({ a: "a", b: "b" })
  @params.naming(({ a, b }) => `parameterized test with params { a: ${a}, b: ${b}}`)
  public "parameterised test with parameterised naming"({ a, b }) {

    assert.equal("a", a, "a === 'a'");
    assert.equal("b", b, "b === 'b'");
  }
}
