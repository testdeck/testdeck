import { assert } from "chai";
import { suite, test } from "../src/";

// need to make this an integration test, checking for the exception there
describe.skip("complete suite inheriting from partial suite", function() {
  @suite class PartialTest {

    protected truthyValue: boolean;

    public before() {

      this.truthyValue = true;
    }

    @test public "test from PartialTest"() {

      assert.isTrue(this.truthyValue, "truthyValue should have been true");
    }
  }

  let declarationFailed;

  // jest first collects all describes and will not execute them directly
  try {

    @suite class CompleteTest extends PartialTest {

      private falsyValue = true;

      public before(): void {

        super.before();

        this.falsyValue = false;
      }

      @test public "test from CompleteTest"() {

        assert.isFalse(this.falsyValue, "falsyValue should have been false");
      }
    }
  } catch (ex) {
    declarationFailed = ex;
  }

  it("must fail", function () {
    assert.ok(declarationFailed instanceof Error);
  });
});

