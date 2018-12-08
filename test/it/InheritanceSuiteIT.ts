import { params, suite, timeout } from "../../index";
import { AbstractSuiteITBase, SuiteTestParams } from "./AbstractSuiteITBase";

@suite(timeout(10000))
class InheritanceSuiteIT extends AbstractSuiteITBase {

  @params({ target: "es5", fixture: "abstract.inheritance.suite" })
  @params({ target: "es6", fixture: "abstract.inheritance.suite" })
  @params({ target: "es5", fixture: "abstract.inheritance.override1.suite" }, "abstract inheritance fail to override abstract test from suite es5")
  @params({ target: "es6", fixture: "abstract.inheritance.override1.suite" }, "abstract inheritance fail override abstract test from suite es6")
  @params({ target: "es5", fixture: "abstract.inheritance.override2.suite" }, "abstract inheritance succeed to override abstract test from suite es5")
  @params({ target: "es6", fixture: "abstract.inheritance.override2.suite" }, "abstract inheritance succeed override abstract test from suite es6")
  @params({ target: "es5", fixture: "suite.inheritance.suite", expectError: true })
  @params({ target: "es6", fixture: "suite.inheritance.suite", expectError: true })
  @params.naming(({ target, fixture }: SuiteTestParams) => `${fixture} ${target}`)
  runTest(params: SuiteTestParams) {

    super.runTest(params);
  }
}
