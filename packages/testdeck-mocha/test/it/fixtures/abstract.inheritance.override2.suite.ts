import { assert } from "chai";
import { suite, test } from "../../../src/";

abstract class AbstractTestBase {

  @test public "inherited test from AbstractTestBase"() {

    assert.fail("derived suites must implement this");
  }
}

@suite class ConcreteTest extends AbstractTestBase {

  @test public "inherited test from AbstractTestBase"() {

    assert.ok(true);
  }
}
