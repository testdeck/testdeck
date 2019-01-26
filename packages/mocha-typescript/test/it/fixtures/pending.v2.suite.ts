import { suite, test, timeout } from "../../../index";
import { TIMEOUT } from "../constants";

@suite.pending class Pending1 {
    @test public test1() {}
}
@suite.skip class Skip2 {
    @test public test2() {}
}
@suite.skip("skipped") class Skip3 {
    @test public test3() {}
}
@suite.skip(timeout(TIMEOUT)) class Skip4 {
    @test public test4() {}
}
@suite.pending("pending") class Pending3 {
    @test public test5() {}
}
@suite.pending(timeout(TIMEOUT)) class Pending4 {
    @test public test6() {}
}

@suite class Suite2 {
    @test public test1() {}
}
