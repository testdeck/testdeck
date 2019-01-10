import { params, suite, timeout } from "../../index";
import { AbstractSuiteITBase, SuiteTestParams } from "./AbstractSuiteITBase";

@suite(timeout(10000))
class GeneratedSuiteIT extends AbstractSuiteITBase {

  @params({ target: "es5", fixture: "generated.suite" })
  @params({ target: "es6", fixture: "generated.suite" })
  @params.naming(({ target, fixture }: SuiteTestParams) => `${fixture} ${target}`)
  runTest(params: SuiteTestParams) {

    super.runTest(params);
  }
}
