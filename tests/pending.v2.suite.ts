import { suite, test, slow, timeout, skip, only, pending } from "../index";

@suite.pending class Pending1 {
    @test test1() {}
}
@suite.skip class Skip2 {
    @test test2() {}
}
@suite.skip("skipped") class Skip3 {
    @test test3() {}
}
@suite.skip(timeout(20)) class Skip4 {
    @test test4() {}
}
@suite.pending("pending") class Pending3 {
    @test test5() {}
}
@suite.pending(timeout(20)) class Pending4 {
    @test test6() {}
}

@suite class Suite2 {
    @test test1() {}
}