import { suite, test, slow, timeout, skip, only, pending } from "../../index";

@suite @only class Suite1 {
    @test test1() {}
}
@suite class Suite2 {
    @test test1() {}
}