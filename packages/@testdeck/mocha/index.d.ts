/// <reference types="mocha" />
import * as core from "@testdeck/core";
declare class MochaClassTestUI extends core.ClassTestUI<Mocha.Suite, Mocha.Context> {
    private static readonly skipAllSymbol;
    readonly skipOnError: core.SuiteTrait<Mocha.Suite>;
    constructor(runner?: core.TestRunner<Mocha.Suite, Mocha.Context>);
}
declare const mochaDecorators: MochaClassTestUI;
export = mochaDecorators;
