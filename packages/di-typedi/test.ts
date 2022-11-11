import { suite, test } from "@testdeck/mocha";

import { assert } from "chai";

// register TypeDI support with testdeck and also let reflect-metadata do it's magic
import "./index";

import "reflect-metadata";

import { Service } from "typedi";

@Service()
class SomeService {

  public doSomething(): boolean {

    return true;
  }
}

@suite
@Service()
class Hello {

  public constructor(private service: SomeService) {
  }

  @test
  public world() {

    assert.isTrue(this.service.doSomething());
  }
}
