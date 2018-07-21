import { suite, test } from "../../index";

@suite()
class AsyncSuite {
    static before(done) {
        setTimeout(done, 1);
    }

    before(done) {
        setTimeout(done, 1);
    }

    @test test(done) {
        setTimeout(done, 1);
    }

    after(done) {
        setTimeout(done, 1);
    }

    static after(done) {
        setTimeout(done, 1);
    }
}
