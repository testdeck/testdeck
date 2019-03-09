import { assert } from "chai";
import { suite, test } from "../src/";

abstract class AbstractTestBase {

  @test public "inherited test from AbstractTestBase"() {

    assert.fail("derived suites must implement this");
  }
}

// we need an integration test for this
@suite.skip class ConcreteTest extends AbstractTestBase {

}
