import { params, suite, timeout } from "../../src/";
import { AbstractSuiteITBase, SuiteTestParams } from "./AbstractSuiteITBase";

@suite(timeout(10000))
class PendingSuiteIT extends AbstractSuiteITBase {

  @params({ target: "es5", fixture: "pending.v2.suite" })
  @params({ target: "es6", fixture: "pending.v2.suite" })
  @params({ target: "es5", fixture: "pending.suite" })
  @params({ target: "es6", fixture: "pending.suite" })
  @params.naming(({ target, fixture }: SuiteTestParams) => `${fixture} ${target}`)
  runTest(params: SuiteTestParams) {

    super.runTest(params);
  }
}
