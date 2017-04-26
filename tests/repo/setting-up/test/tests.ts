// Reference mocha-typescript's global definitions:
/// <reference path="../node_modules/mocha-typescript/globals.d.ts" />

@suite(timeout(3000), slow(1000))
class Hello {
    @test world() {
    }
}
