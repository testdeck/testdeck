import { assert } from "chai";
import { suite, test } from "../../index";

@suite class PartialTest {

  protected _truthyValue: boolean;

  before() {

    this._truthyValue = true;
  }

  @test "test from PartialTest"() {

    assert.isTrue(this._truthyValue, "truthyValue should have been true");
  }
}

@suite class CompleteTest extends PartialTest {

  private _falsyValue = true;

  before(): void {

    super.before();

    this._falsyValue = false;
  }

  @test "test from CompleteTest"() {

    assert.isFalse(this._falsyValue, "falsyValue should have been false");
  }
}
