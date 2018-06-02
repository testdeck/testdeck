import { assert } from "chai";
import { suite, test } from "../../index";

@suite class PartialTest {

  @test.skip "test must be implemented by derived suites"() {

  }
}

@suite class CompleteTest extends PartialTest {

}
