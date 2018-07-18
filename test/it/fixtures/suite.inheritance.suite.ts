import { assert } from "chai";
import { suite, test } from "../../../index";

@suite class PartialTest {

  protected truthyValue: boolean;

  public before() {

    this.truthyValue = true;
  }

  @test public "test from PartialTest"() {

    assert.isTrue(this.truthyValue, "truthyValue should have been true");
  }
}

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
