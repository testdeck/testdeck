import { suite, test, slow, timeout, skip, pending, only } from "./index";
import { assert } from "chai";
import { spawnSync } from "child_process";
import * as path from "path";
import * as rimraf from "rimraf";
import * as fs from "fs";

function assertContent(actualStr: string, expectedStr: string) {

    let actual: string[] = actualStr.split("\n");
    let expected: string[] = expectedStr.split("\n");

    assert.equal(actual.length, expected.length, "actual and expected differ in length");
    for(var i = 0; i < expected.length; i++) {
      let expectedLine = expected[i].trim();
      let actualLine = actual[i].trim();
      assert.isTrue(actualLine.indexOf(expectedLine) !== -1,
        "Unexpected output on line '" + i + "'. Expected: '" +
        expectedLine + "' to be contained in '" + actualLine + "'");
    }
}

function assertOutput(actual: string, filePath: string) {

    let expected = "";
    try {
        expected = fs.readFileSync(filePath, "utf-8");
        assertContent(cleanup(actual, true), cleanup(expected, true));
    } catch (e) {
        console.log("\nerror while testing " + filePath.replace(__dirname, ""));
        console.log("\n" + e.toString());
        console.log("\n<<<<< expected\n" + expected);
        console.log("\n>>>>> actual\n" + cleanup(actual) + "=====");
        throw e;
    }
}

const ELIMINATE_LINE = "__mts_eliminate_line__";

function cleanup(str: string, eliminateAllEmptyLines = false): string {

    // clean up times
    let result = str.replace(/\s*[(][\d]+[^)]+[)]/g, "");
    // clean up call stacks
    result = result.replace(/at\s<.+>.*/g, ELIMINATE_LINE);
    result = result.replace(/at\s.+[^:]+:[^:]+:[\d]+/g, ELIMINATE_LINE);
    result = result.replace(/at\s.+[(][^:]+:[^:]+:[^)]+[)]/g, ELIMINATE_LINE);
    result = result.replace(/at\s.+[\[]as\s+[^\]]+[\]].*/g, ELIMINATE_LINE);
    // clean up calls
    result = result.replace(/>\s.+/g, ELIMINATE_LINE);

    return trimEmptyLines(result, eliminateAllEmptyLines);
}

function trimEmptyLines(str: string, eliminateAll = false): string {

    const collected: string[] = [];
    const lines = str.split('\n');
    let emptyLinesCount = 0;
    for (const line of lines) {
        if (line === "" || line.match(/^\s*$/) || line.indexOf(ELIMINATE_LINE) !== -1) {
            emptyLinesCount++;
            continue;
        }
        if (emptyLinesCount && !eliminateAll) {
            collected.push('');
        }
        emptyLinesCount = 0;
        collected.push(line);
    }

    return collected.join('\n');
}

@suite("typescript", slow(5000), timeout(15000))
class SuiteTest {

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

    @test "retries suite es5"() {
        this.run("es5", "retries.suite");
    }

    @test "retries suite es6"() {
        this.run("es6", "retries.suite");
    }

    @test "context suite es6"() {
        this.run("es6", "context.suite");
    }

    @test "abstract inheritance suite es5"() {
        this.run("es5", "abstract.inheritance.suite");
    }

    @test "abstract inheritance suite es6"() {
        this.run("es6", "abstract.inheritance.suite");
    }

    @test "suite inheritance suite es5"() {
        this.run("es5", "suite.inheritance.suite");
    }

    @test "suite inheritance suite es6"() {
        this.run("es6", "suite.inheritance.suite");
    }

    private run(target: string, ts: string) {
        let tsc = spawnSync("node", [path.join(".", "node_modules", "typescript", "bin", "tsc"),
                                     "--experimentalDecorators", "--module", "commonjs", "--target", target, "--lib",
                                     "es6", path.join("tests", "ts", ts + ".ts")]);

        assert.equal(tsc.stdout.toString(), "", "Expected error free tsc.");
        assert.equal(tsc.status, 0);

        let mocha = spawnSync("node", [path.join(".", "node_modules", "mocha", "bin", "_mocha"),
                                       "-C", path.join("tests", "ts", ts + ".js")]);

        let actual = cleanup(mocha.stdout.toString());
        assertOutput(actual, path.join("tests", "ts", ts + ".expected.txt"));
    }
}

// These integration tests are slow, you can uncommend the skip version below during development
// @suite.skip(timeout(90000))
@suite(timeout(90000), slow(10000))
class PackageTest {

    static tgzPath: string;

    @test "can be consumed as module"() {
        this.testPackage("module-usage", false);
    }

    @test "can be consumed as custom ui"() {
        this.testPackage("custom-ui", false);
    }

    @test "readme followed custom ui"() {
        this.testPackage("setting-up", false);
    }

    @test "can be consumed as module with @types/mocha"() {
        this.testPackage("module-usage", true);
    }

    @test "can be consumed as custom ui with @types/mocha"() {
        this.testPackage("custom-ui", true);
    }

    @test "readme followed custom ui with @types/mocha"() {
        this.testPackage("setting-up", true);
    }

    @timeout(30000)
    static before() {
        let pack = spawnSync("npm", ["pack"]);
        assert.equal(pack.stderr.toString(), "");
        assert.equal(pack.status, 0, "npm pack failed.");
        const lines = (<string>pack.stdout.toString()).split("\n").filter(line => !!line);
        assert.isAtLeast(lines.length, 1,
          "Expected atleast one line of output from npm pack with the .tgz name.");
        PackageTest.tgzPath = path.resolve(lines[lines.length - 1]);
    }

    private testPackage(packageName: string, installTypesMocha: boolean = false): void {
        let cwd;
        let npmtest;
        cwd = path.resolve(path.join("tests", "repo"), packageName);
        rimraf.sync(path.join(cwd, "node_modules"));

        let npmi = spawnSync("npm", ["i", "--no-package-lock"], { cwd });
        assert.equal(npmi.status, 0, "'npm i' failed.");

        let args: string[];
        if (installTypesMocha) {
            args = ["i", PackageTest.tgzPath, "@types/mocha", "--no-save", "--no-package-lock"];
        } else {
            args = ["i", PackageTest.tgzPath, "--no-save", "--no-package-lock"];
        }

        let npmitgz = spawnSync("npm", args, { cwd });
        assert.equal(npmitgz.status, 0, "'npm i <tgz>' failed.");

        npmtest = spawnSync("npm", ["test"], { cwd });
        assertOutput(npmtest.stdout.toString(), path.join(cwd, "expected.txt"));
    }
}
