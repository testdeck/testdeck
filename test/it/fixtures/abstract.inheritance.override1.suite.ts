import { assert } from "chai";
import { suite, test } from "../../../index";

abstract class AbstractTestBase {

  @test public "inherited test from AbstractTestBase"() {

    assert.fail("derived suites must implement this");
  }
}

@suite class ConcreteTest extends AbstractTestBase {

}
