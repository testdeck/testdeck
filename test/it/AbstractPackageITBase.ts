import { assert } from "chai";
import { spawnSync } from "child_process";
import * as path from "path";
import * as rimraf from "rimraf";
import { timeout } from "../../index";
import { assertOutput, cleanup } from "./util";

export interface PackageTestParams {

  fixture: string;
  installTypesMocha?: boolean;
}

export abstract class AbstractPackageITBase {

  private static tgzPath: string;

  protected runTest({ fixture, installTypesMocha = false }: PackageTestParams): void {
    let cwd;
    let npmtest;
    cwd = path.resolve(path.join(__dirname, "fixtures", "packages"), fixture);
    rimraf.sync(path.join(cwd, "node_modules"));

    const npmi = spawnSync("npm", ["i", "--no-package-lock"], { cwd });
    assert.equal(npmi.status, 0, "'npm i' failed.");

    let args: string[];
    if (installTypesMocha) {
      args = ["i", AbstractPackageITBase.tgzPath, "@types/mocha", "--no-save", "--no-package-lock"];
    } else {
      args = ["i", AbstractPackageITBase.tgzPath, "--no-save", "--no-package-lock"];
    }

    const npmitgz = spawnSync("npm", args, { cwd });
    assert.equal(npmitgz.status, 0, "'npm i <tgz>' failed.");

    npmtest = spawnSync("npm", ["test"], { cwd, shell: true });

    assert.equal("", cleanup(npmtest.stderr.toString()), "should not have failed");
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
    AbstractPackageITBase.tgzPath = path.resolve(lines[lines.length - 1]);
  }
}
