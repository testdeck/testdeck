import { assert } from "chai";
import { suite, test } from "../../index";

abstract class AbstractTestBase {

  protected _truthyValue: boolean;

  @test "inherited test from AbstractTestBase"() {

    assert.isTrue(this._truthyValue, "truthyValue should have been true");
  }
}

@suite class ConcreteTest extends AbstractTestBase {

  private _falsyValue = false;

  before(): void {

    this._truthyValue = true;
  }

  @test "test from ConcreteTest"() {

    assert.isFalse(this._falsyValue, "falsyValue should have been false");
  }
}
