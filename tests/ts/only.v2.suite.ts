import { suite, test, slow, timeout, skip, only, pending } from "../../index";

@suite.only class Suite1 {
    @test test() {}
}
@suite.only() class Suite2 {
    @test test() {}
}
@suite.only("test suite") class Suite3 {
    @test test() {}
}
@suite.only(timeout(20)) class Suite4 {
    @test test() {}
}
@suite class SuiteNoGo {
    @test test1() {}
}