import { only, pending, skip, slow, suite, test, timeout } from "../../../index";

@suite @only class Suite1 {
    @test public test1() {}
}
@suite class Suite2 {
    @test public test1() {}
}
