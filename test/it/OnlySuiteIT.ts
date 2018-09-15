import { params, suite } from "../../index";
import { AbstractSuiteITBase, SuiteTestParams } from "./AbstractSuiteITBase";

@suite(timeout(10000))
class OnlySuiteIT extends AbstractSuiteITBase {

  @params({ target: "es5", fixture: "only.suite" })
  @params({ target: "es6", fixture: "only.suite" })
  @params({ target: "es5", fixture: "only.v2.suite" })
  @params({ target: "es6", fixture: "only.v2.suite" })
  @params({ target: "es5", fixture: "only.test.suite" })
  @params({ target: "es6", fixture: "only.test.suite" })
  @params({ target: "es5", fixture: "only.tbdd.suite" })
  @params({ target: "es6", fixture: "only.tbdd.suite" })
  @params({ target: "es5", fixture: "only.traits.suite" })
  @params({ target: "es6", fixture: "only.traits.suite" })
  @params.naming(({ target, fixture }: SuiteTestParams) => `${fixture} ${target}`)
  runTest(params: SuiteTestParams) {

    super.runTest(params);
  }
}
