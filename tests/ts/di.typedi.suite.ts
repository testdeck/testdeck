import { suite, test, register } from "../../index";
import { assert } from "chai";
import { Service } from "typedi";
import "../../di/typedi";

@Service()
class Add {
  public do(a: number, b: number) {
    return a + b;
  }
}

@Service()
class Mul {
  public do(a: number, b: number) {
    return a * b;
  }
}

@Service()
class Linear {
  constructor(private add: Add, private mul: Mul) { }
  public do(k: number, x: number, b: number) {
    return this.add.do(this.mul.do(k, x), b);
  }
}

@suite class TypeDITest {
  constructor(public liner: Linear) { }
  @test "test linear function"() {
    const k = 123, x = 63, b = 235;
    assert.equal(this.liner.do(k, x, b), k * x + b,
      `this.liner.do(${k}, ${x}, ${b}) should equal ${k} * ${x} + ${b}`);
  }
}
