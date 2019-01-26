import { assert } from "chai";
import { spawnSync } from "child_process";
import { platform } from "os";
import * as path from "path";
import { assertOutput, cleanup, win32fixes } from "./util";

export interface SuiteTestParams {

    target: string;
    fixture: string;
    expectError?: boolean;
}

export abstract class AbstractSuiteITBase {

    protected runTest({ target, fixture, expectError = false }: SuiteTestParams) {

        const isWin = platform() === "win32";
        const fixtures = path.resolve(__dirname, "fixtures");
        const packagePath = path.resolve("index.ts");
        const mochaPath = path.resolve("node_modules", ".bin", "_mocha" + (isWin ? ".cmd" : ""));
        const mochaArgs = ["--require", "ts-node/register", "--require", packagePath,
                           "-C", path.join(fixtures, `${fixture}.ts`)];

        // we need to run this from inside a different shell process, as it will fail otherwise
        const mocha = spawnSync(mochaPath, mochaArgs, { shell: true });

/* poor man's debug: we will leave this in in case that issues arise on appveyor or travis
        console.log("======stderr");
        console.log(mocha.stderr.toString());
        console.log("======stdout");
        console.log(mocha.stdout.toString());
        console.log("======");
*/

        if (expectError) {

            const actual = win32fixes(mocha.stderr.toString());
            assertOutput(actual, path.join(fixtures, `${fixture}.expected.err.txt`));
        } else {

            assert.equal("", cleanup(mocha.stderr.toString()), "Expected mocha to not fail with error");
            const actual = win32fixes(mocha.stdout.toString());
            assertOutput(actual, path.join(fixtures, `${fixture}.expected.txt`));
        }
    }
}
