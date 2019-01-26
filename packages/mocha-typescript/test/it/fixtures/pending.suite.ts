import { pending, suite, test } from "../../../index";

@suite @pending class Suite1 {
    @test public test1() {}
}
@suite class Suite2 {
    @test public test1() {}
}
