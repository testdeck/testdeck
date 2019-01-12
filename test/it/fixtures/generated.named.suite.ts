import { suite, test } from "../../../index";

class TestSuite {

  @test myTest() {}
}

suite("Named Suite")(TestSuite);
