import { params, skip, slow, suite, timeout } from "../../index";
import { AbstractPackageITBase, PackageTestParams } from "./AbstractPackageITBase";

@suite(timeout(90000), slow(10000))
class CustomUiPackageIT extends AbstractPackageITBase {

  @params({ fixture: "custom-ui", installTypesMocha: false }, "can be consumed as custom ui")
  @params({ fixture: "custom-ui", installTypesMocha: true }, "can be consumed as custom ui with @types/mocha")
  runTest(params: PackageTestParams) {

    super.runTest(params);
  }
}
