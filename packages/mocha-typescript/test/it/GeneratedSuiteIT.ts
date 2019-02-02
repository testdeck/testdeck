import { params, suite, timeout } from "../../src/";
import { AbstractSuiteITBase, SuiteTestParams } from "./AbstractSuiteITBase";

@suite(timeout(10000))
class GeneratedSuiteIT extends AbstractSuiteITBase {

  @params({ target: "es5", fixture: "generated.suite" })
  @params({ target: "es6", fixture: "generated.suite" })
  @params({ target: "es5", fixture: "generated.named.suite" })
  @params({ target: "es6", fixture: "generated.named.suite" })
  @params.naming(({ target, fixture }: SuiteTestParams) => `${fixture} ${target}`)
  runTest(params: SuiteTestParams) {

    super.runTest(params);
  }
}
