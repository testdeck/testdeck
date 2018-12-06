import { params, suite, timeout } from "../../index";
import { AbstractSuiteITBase, SuiteTestParams } from "./AbstractSuiteITBase";

@suite(timeout(10000))
class ContextSuiteIT extends AbstractSuiteITBase {

  @params({ target: "es5", fixture: "context.suite" })
  @params({ target: "es6", fixture: "context.suite" })
  @params.naming(({ target, fixture }: SuiteTestParams) => `${fixture} ${target}`)
  runTest(params: SuiteTestParams) {

    super.runTest(params);
  }
}
