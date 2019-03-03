import { suite, test } from "@testdeck/mocha";

@suite
class Suite1 {
    @test
    "passes"() {
        // one passes
    }
}

@suite
class Suite2 {
    @test
    async(done) {
        done();
    }
}

@suite
class Suite3 {
    @test
    promised() {
        return new Promise((resolve, reject) => {
            setTimeout(resolve, 10);
        });
    }
}

@suite
class Suite4 {
    @test.skip
    skipped() {
    }
}

@suite.skip
class Suite5 {
}
