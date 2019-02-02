import { params, suite, timeout } from "../../src/";
import { AbstractSuiteITBase, SuiteTestParams } from "./AbstractSuiteITBase";

@suite(timeout(10000))
class ParamsSuiteIT extends AbstractSuiteITBase {

  @params({ target: "es5", fixture: "params.suite" })
  @params({ target: "es6", fixture: "params.suite" })
  @params({ target: "es5", fixture: "params.async.suite" })
  @params({ target: "es6", fixture: "params.async.suite" })
  @params({ target: "es5", fixture: "params.skip.suite" })
  @params({ target: "es6", fixture: "params.skip.suite" })
  @params({ target: "es5", fixture: "params.only.suite" })
  @params({ target: "es6", fixture: "params.only.suite" })
  @params({ target: "es5", fixture: "params.naming.suite" })
  @params({ target: "es6", fixture: "params.naming.suite" })
  @params.naming(({ target, fixture }: SuiteTestParams) => `${fixture} ${target}`)
  runTest(params: SuiteTestParams) {

    super.runTest(params);
  }
}
