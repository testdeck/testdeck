import { suite, test, timeout } from "../../../src/";
import { TIMEOUT } from "../constants";

@suite.only class Suite1 {
    @test public test() {}
}
@suite.only() class Suite2 {
    @test public test() {}
}
@suite.only("test suite") class Suite3 {
    @test public test() {}
}
@suite.only(timeout(TIMEOUT)) class Suite4 {
    @test public test() {}
}
@suite class SuiteNoGo {
    @test public test1() {}
}
