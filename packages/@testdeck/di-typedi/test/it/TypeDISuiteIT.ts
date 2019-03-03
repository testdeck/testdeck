import "../../src/";

import { suite, test } from "@testdeck/mocha";

import { assert } from "chai";

import { Service } from "typedi";

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
  constructor(public linear: Linear) { }
  @test public "test linear function"() {
    const k = 123;
    const x = 63;
    const b = 235;
    assert.equal(this.linear.do(k, x, b), k * x + b,
      `this.linear.do(${k}, ${x}, ${b}) should equal ${k} * ${x} + ${b}`);
  }
}
