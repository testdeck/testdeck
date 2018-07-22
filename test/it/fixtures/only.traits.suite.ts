import { suite, test, timeout } from "../../../index";

@suite()
class Suite {
    @test.only(timeout(1))
    testOnlyThis(done) {
        setTimeout(done, 2);
    }

    @test.only("renamed", timeout(1))
    testOnlyThis2(done) {
        setTimeout(done, 2);
    }

    @test(timeout(30))
    testSkipThis() {
    }
}
