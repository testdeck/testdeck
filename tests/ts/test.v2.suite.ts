import { suite, test, slow, timeout, skip, only, trait, skipOnError } from "../../index";

@suite class Simple {
    @test test() {}
}

@suite(timeout(10))
class Timeouts {
    @test pass1(done) {
        setTimeout(done, 1);
    }
    @test pass2(done) {
        setTimeout(done, 20);
    }
    @test pass3(done) {
        setTimeout(done, 1);
    }
}

@suite(trait(ctx => ctx.timeout(10)))
class InlineTrait {
    @test timeout(done) {}
}

@suite(skipOnError)
class StockSequence {
    @test step1() {}
    @test step2() { throw new Error("Failed"); }
    @test step3() { /* should be skipped */ }
    @test step4() { /* should be skipped */ }
}

var customSkipOnError = trait(function(ctx, ctor) {
    beforeEach(function() {
        if (ctor.__skip_all) {
            this.skip();
        }
    });
    afterEach(function() {
        if (this.currentTest.state === "failed") {
            ctor.__skip_all = true;
        }
    });
});

@suite(customSkipOnError)
class CustomSequence {
    @test step1() {}
    @test step2() { throw new Error("Failed"); }
    @test step3() { /* should be skipped */ }
    @test step4() { /* should be skipped */ }
}

@suite("name and trait", customSkipOnError)
class CustomSequence2 {
    @test step1() {}
    @test step2() { throw new Error("Failed"); }
    @test step3() { /* should be skipped */ }
}

@suite(slow(10))
class Slows {
    @test pass1(done) {
        setTimeout(done, 1);
    }
    @test pass2(done) {
        setTimeout(done, 20);
    }
    @test pass3(done) {
        setTimeout(done, 1);
    }
}

@suite("mocha typescript")
class Basic {
    @test "assert pass"() {
    }

    @test() "assert pass 2"() {
    }

    @test "test fail"() {
        throw new Error("Fail intentionally!");
    }

    @test() "test fail 2"() {
        throw new Error("Fail intentionally!");
    }
    
    @test.skip "test skip"() {
    }

    @test(timeout(5))
    "test intentinally timeout"(done) {
        setTimeout(done, 10);
    }

    @test(timeout(20))
    "test intentinall fail due error before timeout"(done) {
        setTimeout(() => done("Ooopsss..."), 5);
    }

    @test(timeout(100), slow(20))
    "test won't timeout but will be redish slow"(done) {
        setTimeout(done, 30);
    }

    @test(timeout(100), slow(20))
    "test won't timeout but will be yellowish slow"(done) {
        setTimeout(done, 15);
    }
}

@suite.skip
class Skipped1 {
    @test test() {}
}

@suite.skip()
class Skipped2 {
    @test test() {}
}

@suite.pending
class Pending1 {
    @test pending() {}
}

@suite.pending()
class Pending2 {
    @test pending() {}
}

@suite.pending(skipOnError)
class Pending3 {
    @test pending() {}
}

@suite("custom suite name")
class Test {
    @test("custom test name") test() {}
}