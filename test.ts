import { assert } from "chai";
import { spawnSync } from "child_process";
import * as fs from "fs";
import * as path from "path";
import * as rimraf from "rimraf";
import { only, params, pending, skip, slow, suite, test, timeout } from "./index";

function assertContent(actualStr: string, expectedStr: string) {

    const actual: string[] = actualStr.split("\n");
    const expected: string[] = expectedStr.split("\n");

    assert.equal(actual.length, expected.length, "actual and expected differ in length");
    for (let i = 0; i < expected.length; i++) {
      const expectedLine = expected[i].trim();
      const actualLine = actual[i].trim();
      assert.isTrue(actualLine.indexOf(expectedLine) !== -1,
        "Unexpected output on line '" + i + "'. Expected: '" +
        expectedLine + "' to be contained in '" + actualLine + "'");
    }
}

function assertExactOutput(actual: string, filePath: string) {
    const expected = fs.readFileSync(filePath, "utf-8");
    assert.equal(actual, expected);
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
    const lines = str.split("\n");
    let emptyLinesCount = 0;
    for (const line of lines) {
        if (line === "" || line.match(/^\s*$/) || line.indexOf(ELIMINATE_LINE) !== -1) {
            emptyLinesCount++;
            continue;
        }
        if (emptyLinesCount && !eliminateAll) {
            collected.push("");
        }
        emptyLinesCount = 0;
        collected.push(line);
    }

    return collected.join("\n");
}

@suite("typescript", slow(5000), timeout(15000))
class SuiteTest {

    @params({ target: "es5", ts: "test.suite" })
    @params({ target: "es6", ts: "test.suite" })
    @params({ target: "es5", ts: "test.v2.suite" })
    @params({ target: "es6", ts: "test.v2.suite" })
    @params({ target: "es5", ts: "only.v2.suite" })
    @params({ target: "es6", ts: "only.v2.suite" })
    @params({ target: "es5", ts: "pending.v2.suite" })
    @params({ target: "es6", ts: "pending.v2.suite" })
    @params({ target: "es5", ts: "only.suite" })
    @params({ target: "es6", ts: "only.suite" })
    @params({ target: "es5", ts: "pending.suite" })
    @params({ target: "es6", ts: "pending.suite" })
    @params({ target: "es5", ts: "retries.suite" })
    @params({ target: "es6", ts: "retries.suite" })
    @params({ target: "es6", ts: "context.suite" })
    @params({ target: "es5", ts: "abstract.inheritance.suite" })
    @params({ target: "es6", ts: "abstract.inheritance.suite" })
    @params({ target: "es5", ts: "suite.inheritance.suite" })
    @params({ target: "es6", ts: "suite.inheritance.suite" })
    @params({ target: "es5", ts: "abstract.inheritance.override1.suite" }, "abstract inheritance fail to override abstract test from suite es5")
    @params({ target: "es6", ts: "abstract.inheritance.override1.suite" }, "abstract inheritance fail override abstract test from suite es6")
    @params({ target: "es5", ts: "abstract.inheritance.override2.suite" }, "abstract inheritance succeed to override abstract test from suite es5")
    @params({ target: "es6", ts: "abstract.inheritance.override2.suite" }, "abstract inheritance succeed override abstract test from suite es6")
    @params({ target: "es5", ts: "suite.inheritance.override1.suite" }, "suite inheritance fail to override abstract test from suite es5")
    @params({ target: "es6", ts: "suite.inheritance.override1.suite" }, "suite inheritance fail override abstract test from suite es6")
    @params({ target: "es5", ts: "suite.inheritance.override2.suite" }, "suite inheritance succeed to override abstract test from suite es5")
    @params({ target: "es6", ts: "suite.inheritance.override2.suite" }, "suite inheritance succeed override abstract test from suite es6")
    @params.naming(({ target, ts }) => `${ts} ${target}`)
    public run({ target, ts }) {
        const tsc = spawnSync("node", [path.join(".", "node_modules", "typescript", "bin", "tsc"),
            "--experimentalDecorators", "--module", "commonjs", "--target", target, "--lib",
            "es6", path.join("tests", "ts", ts + ".ts")]);

        assert.equal(tsc.stdout.toString(), "", "Expected error free tsc.");
        assert.equal(tsc.status, 0);

        const mocha = spawnSync("node", [path.join(".", "node_modules", "mocha", "bin", "_mocha"),
            "-C", path.join("tests", "ts", ts + ".js")]);

        assert.equal("", mocha.stderr.toString(), "Excpected mocha to not fail with error");

        const actual = cleanup(mocha.stdout.toString());
        assertOutput(actual, path.join("tests", "ts", ts + ".expected.txt"));
    }
}

// These integration tests are slow, you can uncommend the skip version below during development
// @suite.skip(timeout(90000))
@suite(timeout(90000), slow(10000))
class PackageTest {

    public static tgzPath: string;

    @params({ packageName: "module-usage", installTypesMocha: false }, "can be consumed as module")
    @params({ packageName: "custom-ui", installTypesMocha: false }, "can be consumed as custom ui")
    @params({ packageName: "setting-up", installTypesMocha: false }, "readme followed custom ui")
    @params({ packageName: "module-usage", installTypesMocha: true }, "can be consumed as module with @types/mocha")
    @params({ packageName: "custom-ui", installTypesMocha: true }, "can be consumed as custom ui with @types/mocha")
    @params({ packageName: "setting-up", installTypesMocha: true }, "readme followed custom ui with @types/mocha")
    public testPackage({ packageName, installTypesMocha = false }): void {
        let cwd;
        let npmtest;
        cwd = path.resolve(path.join("tests", "repo"), packageName);
        rimraf.sync(path.join(cwd, "node_modules"));

        const npmi = spawnSync("npm", ["i", "--no-package-lock"], { cwd });
        assert.equal(npmi.status, 0, "'npm i' failed.");

        let args: string[];
        if (installTypesMocha) {
            args = ["i", PackageTest.tgzPath, "@types/mocha", "--no-save", "--no-package-lock"];
        } else {
            args = ["i", PackageTest.tgzPath, "--no-save", "--no-package-lock"];
        }

        const npmitgz = spawnSync("npm", args, { cwd });
        assert.equal(npmitgz.status, 0, "'npm i <tgz>' failed.");

        npmtest = spawnSync("npm", ["test"], { cwd });

        assertExactOutput(npmtest.stderr.toString(), path.join(cwd, "expected.err.txt"));
        assertOutput(npmtest.stdout.toString(), path.join(cwd, "expected.txt"));
    }

    @timeout(30000)
    public static before() {
        const pack = spawnSync("npm", ["pack", "--quiet"]);
        assert.equal(pack.stderr.toString(), "");
        assert.equal(pack.status, 0, "npm pack failed.");
        const lines = (pack.stdout.toString() as string).split("\n").filter((line) => !!line);
        assert.isAtLeast(lines.length, 1,
          "Expected atleast one line of output from npm pack with the .tgz name.");
        PackageTest.tgzPath = path.resolve(lines[lines.length - 1]);
    }
}
