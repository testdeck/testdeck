import { assert } from "chai";
import { suite, test } from "../../index";

abstract class AbstractTestBase {

  protected truthyValue: boolean;

  @test public "inherited test from AbstractTestBase"() {

    assert.isTrue(this.truthyValue, "truthyValue should have been true");
  }
}

@suite class ConcreteTest extends AbstractTestBase {

  private falsyValue = false;

  public before(): void {

    this.truthyValue = true;
  }

  @test public "test from ConcreteTest"() {

    assert.isFalse(this.falsyValue, "falsyValue should have been false");
  }
}
