import { suite, test } from "../../index";
import { assert } from "chai";

abstract class AbstractTestBase {

  @test "inherited test from AbstractTestBase"() {

    assert.fail('derived suites must implement this');
  }
}

@suite class ConcreteTest extends AbstractTestBase {

  @test "inherited test from AbstractTestBase"() {

    assert.ok(true);
  }
}
