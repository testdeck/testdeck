import { suite, test } from "../src/";

class TestSuite {

  @test myTest() {}
}

suite("Named Suite")(TestSuite);
