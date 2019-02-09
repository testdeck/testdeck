import { params, skip, slow, suite, timeout } from "../../src";
import { AbstractPackageITBase, PackageTestParams } from "./AbstractPackageITBase";

import { ChildProcess, spawn } from "child_process";

import * as assert from "assert";
import { existsSync, unlinkSync, writeFileSync } from "fs";
import { join, resolve } from "path";
import * as readline from "readline";

import { AbstractPackageITBase, PackageTestParams } from "./AbstractPackageITBase";

import { spawnSync, SpawnSyncReturns } from "child_process";

import * as path from "path";

@suite(timeout(200000), slow(90000))
class WatcherPackage extends AbstractPackageITBase {

  watch: SpawnSyncReturns<Buffer>;

  @params({ fixture: "watcher", installTypesMocha: false }, "can run watcher")
  @params({ fixture: "watcher", installTypesMocha: true }, "can run watcher with @types/mocha")
  public runTest(params: PackageTestParams) {
    this.install(params);
    const cwd = path.resolve(__dirname, "fixtures", "packages", params.fixture);
    this.watch = spawnSync("npm", ["run", "watch"], {
      cwd,
      shell: true,
    });
    this.runStandardAssertionsOnExternalProcess(this.watch, cwd);
  }
}
