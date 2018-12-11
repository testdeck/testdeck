import { suite, test } from "../../../index";

@suite class Suite1 {
    @test public test1() {}
    @test.only public test2() {}
}
