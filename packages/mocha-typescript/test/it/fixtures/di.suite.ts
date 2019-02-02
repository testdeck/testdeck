import { assert } from "chai";

import { registerDI, suite, test } from "../../../src/";

const MARK = "INJECTED";

registerDI({
  // handles<T>(cls: Class<T>): boolean {
  handles<T>(cls): boolean {
    return cls[MARK] === true;
  },
  // create<T>(cls: Class<T>): T {
  create<T>(cls): T {
    return new cls(new KnownDependency());
  },
});

class KnownDependency {
  public get isKnownDependency(): boolean {
    return true;
  }
}

@suite
class KnownDependencyInjectionTest {

  public static readonly INJECTED = true;

  public constructor(private knownDependency: KnownDependency) {}

  @test
  injected(): void {
    assert.isNotNull(this.knownDependency);
    assert.isTrue(this.knownDependency.isKnownDependency);
  }
}

@suite
class DefaultHandledDependencyInjectionTest {

  @test
  injected(): void {
  }
}
