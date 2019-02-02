import { only, suite, test } from "../../../src/";

@suite @only class Suite1 {
    @test public test1() {}
}
@suite class Suite2 {
    @test public test1() {}
}
