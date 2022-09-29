import { suite, test } from "@testdeck/mocha";

import { expect } from "chai";

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
class Hello {

    public constructor(private service: SomeService) {
    }

    @test
    public world() {
        expect(this.service.doSomething()).to.be.true;
    }
}
