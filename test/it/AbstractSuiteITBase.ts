import { assert } from "chai";
import { spawnSync } from "child_process";
import * as path from "path";
import { assertOutput, cleanup } from "./util";

export interface SuiteTestParams {

    target: string;
    fixture: string;
    expectError?: boolean;
}

export abstract class AbstractSuiteITBase {

    protected runTest({ target, fixture, expectError = false }: SuiteTestParams) {

        const fixtures = path.resolve(__dirname, "fixtures", `${fixture}.ts`);
        const packagePath = path.resolve("index.ts");
        const mochaPath = path.resolve("node_modules", ".bin", "_mocha");
        const mochaArgs = ["--require", "ts-node/register", "--require", packagePath,
                           "--ui mocha-typescript", "-C", fixtures];

        // we need to run this from inside a different shell process, as it will fail otherwise
        const mocha = spawnSync("node", [mochaPath].concat(mochaArgs), { shell: true });

        if (expectError) {

            const actual = mocha.stderr.toString();
            assertOutput(actual, path.join(fixtures, `${fixture}.expected.err.txt`));
        } else {

            assert.equal("", cleanup(mocha.stderr.toString()), "Expected mocha to not fail with error");
            const actual = mocha.stdout.toString();
            assertOutput(actual, path.join(fixtures, `${fixture}.expected.txt`));
        }
    }
}
