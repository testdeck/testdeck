import { params, suite } from "../../index";
import { AbstractSuiteITBase, SuiteTestParams } from "./AbstractSuiteITBase";

@suite(timeout(10000))
class StandardFeaturesSuiteIT extends AbstractSuiteITBase {

  @params({ target: "es5", fixture: "test.suite" })
  @params({ target: "es6", fixture: "test.suite" })
  @params({ target: "es5", fixture: "test.v2.suite" })
  @params({ target: "es6", fixture: "test.v2.suite" })
  @params.naming(({ target, fixture }: SuiteTestParams) => `${fixture} ${target}`)
  runTest(params: SuiteTestParams) {

    super.runTest(params);
  }
}
