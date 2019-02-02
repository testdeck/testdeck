import { params, suite, timeout } from "../../src/";
import { AbstractSuiteITBase, SuiteTestParams } from "./AbstractSuiteITBase";

@suite(timeout(10000))
class DependencyInjectionSuiteIT extends AbstractSuiteITBase {

  @params({ target: "es5", fixture: "di.suite" })
  @params({ target: "es6", fixture: "di.suite" })
  @params.naming(({ target, fixture }: SuiteTestParams) => `${fixture} ${target}`)
  runTest(params: SuiteTestParams) {

    super.runTest(params);
  }
}
