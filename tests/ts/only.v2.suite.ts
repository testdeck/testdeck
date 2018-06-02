import { only, pending, skip, slow, suite, test, timeout } from "../../index";

@suite.only class Suite1 {
    @test public test() {}
}
@suite.only() class Suite2 {
    @test public test() {}
}
@suite.only("test suite") class Suite3 {
    @test public test() {}
}
@suite.only(timeout(20)) class Suite4 {
    @test public test() {}
}
@suite class SuiteNoGo {
    @test public test1() {}
}
