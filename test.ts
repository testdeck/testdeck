import { suite, test, slow, timeout } from "./index";

var child_process = require("child_process");
var assert = require("better-assert");
var chai = require("chai");
var fs = require("fs");

var spawnSync = child_process.spawnSync;

@suite("typescript") class SuiteTest {

    @test("target es5") @slow(5000) @timeout(15000) es5() {
        this.run("es5");
    }

    @test("target es6") @slow(5000) @timeout(15000) es6() {
        this.run("es6");
    }

    run(target: string) {
        let tsc = spawnSync("node", ["./node_modules/typescript/bin/tsc", "--experimentalDecorators", "--module", "commonjs", "--target", target, "test.suite.ts"]);
        assert(tsc.stdout.toString() === "");
        assert(tsc.status === 0);

        let mocha = spawnSync("node", ["./node_modules/mocha/bin/_mocha", "test.suite.js"]);
        // To debug any actual output while developing:
        // console.log(mocha.stdout.toString());
        assert(mocha.status !== 0);

        let actual = mocha.stdout.toString().split("\n");
        let expected = fs.readFileSync("./test.suite.expected.txt", "utf-8").split("\n");

        // To patch the expected use the output of this, but clean up times and callstacks:
        // console.log("exp: " + actual);

        for(var i = 0; i < expected.length; i++) {
            let expectedLine = expected[i].trim();
            let actualLine = actual[i].trim();
            if (actualLine.indexOf(expectedLine) === -1) {
                throw new Error("Unexpected output. Expected: '" + expectedLine + "' to be contained in '" + actualLine + "'");
            }
        }
    }
}
