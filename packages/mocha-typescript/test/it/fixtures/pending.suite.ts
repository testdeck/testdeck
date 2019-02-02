import { pending, suite, test } from "../../../src/";

@suite @pending class Suite1 {
    @test public test1() {}
}
@suite class Suite2 {
    @test public test1() {}
}
