import { assert } from "chai";
import { spawnSync } from "child_process";
import * as path from "path";
import * as rimraf from "rimraf";
import { timeout } from "../../src/";
import { assertOutput, cleanup, win32fixes } from "./util";

export interface PackageTestParams {
  fixture: string;
  installTypesMocha?: boolean;
}

export abstract class AbstractPackageITBase {

  private static tgzPath: string;

  protected runTest({ fixture, installTypesMocha = false }: PackageTestParams): void {
    this.install({fixture, installTypesMocha});
    const cwd = path.resolve(__dirname, "fixtures", "packages", fixture);
    const npmtest = spawnSync("npm", ["test"], { cwd, shell: true });
    this.runStandardAssertionsOnExternalProcess(npmtest, cwd);
  }

  protected runStandardAssertionsOnExternalProcess(externalProcess, cwd) {
    assert.equal("", cleanup(externalProcess.stderr.toString()), "should not have failed");
    assertOutput(win32fixes(externalProcess.stdout.toString()), path.join(cwd, "expected.txt"));
  }

  protected install({ fixture, installTypesMocha = false }: PackageTestParams): void {
    let cwd;
    cwd = path.resolve(__dirname, "fixtures", "packages", fixture);
    rimraf.sync(path.join(cwd, "node_modules"));

    const npmi = spawnSync("npm", ["i", "--no-package-lock"], { cwd, shell: true });
    assert.equal(npmi.status, 0, "'npm i' failed.");

    let args: string[];
    if (installTypesMocha) {
      args = ["i", AbstractPackageITBase.tgzPath, "@types/mocha", "--force", "-dd", "--no-save", "--no-package-lock"];
    } else {
      args = ["i", AbstractPackageITBase.tgzPath, "--force", "-dd", "--no-save", "--no-package-lock"];
    }

    const npmitgz = spawnSync("npm", args, { cwd, shell: true });
    // we keep this in in case any issues arise
    console.log(npmitgz.stdout.toString());
    console.log(npmitgz.stderr.toString());
    assert.equal(npmitgz.status, 0, "'npm i <tgz>' failed.");
  }

  @timeout(30000)
  public static before() {

    // TODO: Also pack @testdeck/core...

    const pack = spawnSync("npm", ["pack", "--quiet"], { shell: true });
    assert.equal(pack.stderr.toString(), "");
    assert.equal(pack.status, 0, "npm pack failed.");
    const lines = (pack.stdout.toString() as string).split("\n").filter((line) => !!line);
    assert.isAtLeast(lines.length, 1,
      "Expected atleast one line of output from npm pack with the .tgz name.");
    AbstractPackageITBase.tgzPath = path.resolve(lines[lines.length - 1]);
  }
}
