import { params, suite } from "../../index";
import { AbstractSuiteITBase, SuiteTestParams } from "./AbstractSuiteITBase";

@suite(timeout(10000))
class RetriesSuiteIT extends AbstractSuiteITBase {

  @params({ target: "es5", fixture: "retries.suite" })
  @params({ target: "es6", fixture: "retries.suite" })
  @params.naming(({ target, fixture }: SuiteTestParams) => `${fixture} ${target}`)
  runTest(params: SuiteTestParams) {

    super.runTest(params);
  }
}
