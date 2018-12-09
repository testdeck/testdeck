import { assert } from "chai";
import { spawnSync } from "child_process";
import * as path from "path";
import * as rimraf from "rimraf";
import { timeout } from "../../index";
import { assertOutput, cleanup, win32fixes } from "./util";

export interface PackageTestParams {
  fixture: string;
  installTypesMocha?: boolean;
}

export abstract class AbstractPackageITBase {

  private static tgzPath: string;

  protected runTest({ fixture, installTypesMocha = false }: PackageTestParams): void {
    let cwd;
    let npmtest;
    cwd = path.resolve(__dirname, "fixtures", "packages", fixture);
    rimraf.sync(path.join(cwd, "node_modules"));

    const npmi = spawnSync("npm", ["i", "--no-package-lock"], { cwd, shell: true });
    assert.equal(npmi.status, 0, "'npm i' failed.");

    let args: string[];
    if (installTypesMocha) {
      args = ["i", AbstractPackageITBase.tgzPath, "@types/mocha", "-ddd", "--no-save", "--no-package-lock"];
    } else {
      args = ["i", AbstractPackageITBase.tgzPath, "-ddd", "--no-save", "--no-package-lock"];
    }

    const npmitgz = spawnSync("npm", args, { cwd, shell: true });
    // we keep this in in case any issues arise
    // console.log(npmitgz.stderr.toString());
    assert.equal(npmitgz.status, 0, "'npm i <tgz>' failed.");

    npmtest = spawnSync("npm", ["test"], { cwd, shell: true });
    assert.equal("", cleanup(npmtest.stderr.toString()), "should not have failed");
    assertOutput(win32fixes(npmtest.stdout.toString()), path.join(cwd, "expected.txt"));
  }

  @timeout(30000)
  public static before() {
    const pack = spawnSync("npm", ["pack", "--quiet"], { shell: true });
    assert.equal(pack.stderr.toString(), "");
    assert.equal(pack.status, 0, "npm pack failed.");
    const lines = (pack.stdout.toString() as string).split("\n").filter((line) => !!line);
    assert.isAtLeast(lines.length, 1,
      "Expected atleast one line of output from npm pack with the .tgz name.");
    AbstractPackageITBase.tgzPath = path.resolve(lines[lines.length - 1]);
  }
}
