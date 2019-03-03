import { suite, test } from "../src/";

@suite class Suite1 {
    @test public test1() {}
    @test.only public test2() {}
}
