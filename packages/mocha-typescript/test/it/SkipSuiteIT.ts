import { params, suite, timeout } from "../../src/";
import { AbstractSuiteITBase, SuiteTestParams } from "./AbstractSuiteITBase";

@suite(timeout(10000))
class SkipSuiteIT extends AbstractSuiteITBase {

  @params({ target: "es5", fixture: "skip.suite" })
  @params({ target: "es6", fixture: "skip.suite" })
  @params.naming(({ target, fixture }: SuiteTestParams) => `${fixture} ${target}`)
  runTest(params: SuiteTestParams) {

    super.runTest(params);
  }
}
