import { params, suite } from "../../index";
import { AbstractSuiteITBase, SuiteTestParams } from "./AbstractSuiteITBase";

@suite(timeout(10000))
class AsyncSuiteIT extends AbstractSuiteITBase {

  @params({ target: "es5", fixture: "async.suite" })
  @params({ target: "es6", fixture: "async.suite" })
  @params.naming(({ target, fixture }: SuiteTestParams) => `${fixture} ${target}`)
  runTest(params: SuiteTestParams) {
    super.runTest(params);
  }
}
