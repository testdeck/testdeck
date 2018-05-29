import { suite, test } from "../../index";
import { assert } from "chai";

@suite class PartialTest {

  @test.skip "test must be implemented by derived suites"() {

  }
}

@suite class CompleteTest extends PartialTest {

}
