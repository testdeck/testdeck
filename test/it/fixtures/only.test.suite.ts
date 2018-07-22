import { only, pending, skip, slow, suite, test, timeout } from "../../../index";

@suite class Suite1 {
    @test public test1() {}
    @test.only public test2() {}
}
