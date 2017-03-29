import { suite, test, slow, timeout, pending, only } from "./index";

var child_process = require("child_process");
var assert = require("better-assert");
var chai = require("chai");
var fs = require("fs");

var spawnSync = child_process.spawnSync;

// @pending class One {
//     @pending test1() {};
//     @test test2() {};
//     @only test3() {}
// }

@suite("typescript") @slow(5000) @timeout(15000) class SuiteTest {

    @test("target v1 es5") es5() {
        this.run("es5", "test.suite");
    }

    @test("target v1 es6") es6() {
        this.run("es6", "test.suite");
    }

    @test("target v2 es5") v2es5() {
        this.run("es5", "test.v2.suite");
    }

    @test("target v2 es6") v2es6() {
        this.run("es6", "test.v2.suite");
    }

    @test "only v2 suite es5"() {
        this.run("es5", "only.v2.suite");
    }

    @test "only v2 suite es6"() {
        this.run("es6", "only.v2.suite");
    }

    @test "pending v2 suite es5"() {
        this.run("es5", "pending.v2.suite");
    }

    @test "pending v2 suite es6"() {
        this.run("es6", "pending.v2.suite");
    }

    @test "only suite es5"() {
        this.run("es5", "only.suite");
    }

    @test "only suite es6"() {
        this.run("es6", "only.suite");
    }

    @test "pending suite es5"() {
        this.run("es5", "pending.suite");
    }

    @test "pending suite es6"() {
        this.run("es6", "pending.suite");
    }

    @test "context suite es6"() {
        this.run("es6", "context.suite");
    }

    run(target: string, ts: string) {
        let tsc = spawnSync("node", ["./node_modules/typescript/bin/tsc", "--experimentalDecorators", "--module", "commonjs", "--target", target, "--lib", "es6", "tests/" + ts + ".ts"]);

        // console.log(tsc.stdout.toString());
        assert(tsc.stdout.toString() === "");
        assert(tsc.status === 0);

        let mocha = spawnSync("node", ["./node_modules/mocha/bin/_mocha", "tests/" + ts + ".js"]);
        // To debug any actual output while developing:
        // assert(mocha.status !== 0);

        // console.log(mocha.stderr.toString());

        let actual = mocha.stdout.toString().split("\n");
        let expected = fs.readFileSync("./tests/" + ts + ".expected.txt", "utf-8").split("\n");

        // To patch the expected use the output of this, but clean up times and callstacks:
        // console.log("out:\n" + actual.join("\n"));

        for(var i = 0; i < expected.length; i++) {
            if (actual.length <= i) {
                throw new Error("Actual output is shorter than expected, acutal lines: " + actual.length + ", expected: " + expected.length);
            }
            let expectedLine = expected[i].trim();
            let actualLine = actual[i].trim();
            if (actualLine.indexOf(expectedLine) === -1) {
                throw new Error("Unexpected output. Expected: '" + expectedLine + "' to be contained in '" + actualLine + "'");
            }
        }
    }
}
