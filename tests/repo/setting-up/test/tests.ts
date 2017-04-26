/// <reference path="../node_modules/mocha-typescript/globals.d.ts" /> Reference mocha-typescript's global definitions

@suite(timeout(3000), slow(1000))
class Hello {
    @test world() {
    }
}
