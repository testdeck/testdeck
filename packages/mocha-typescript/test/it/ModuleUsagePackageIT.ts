import { params, slow, suite, timeout } from "../../index";
import { AbstractPackageITBase, PackageTestParams } from "./AbstractPackageITBase";

@suite(timeout(200000), slow(10000))
class ModuleUsagePackageIT extends AbstractPackageITBase {

  @params({ fixture: "module-usage", installTypesMocha: false }, "can be consumed as module")
  @params({ fixture: "module-usage", installTypesMocha: true }, "can be consumed as module with @types/mocha")
  runTest(params: PackageTestParams) {

    super.runTest(params);
  }
}
