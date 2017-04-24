import { suite, test, timeout, slow, skipOnError } from "mocha-typescript";

@suite class Suite1 {
    @test "one"() {
        // one passes
    }
    @test "two"() {
        // tow fails
        throw new Error("instant fail");
    }
    @test "three"() {
        return new Promise((resolve, reject) => {
            setTimeout(resolve, 10);
        });
    }
    @test "four"() {
        return new Promise((resolve, reject) => {
            setTimeout(() => reject(new Error("async fail")), 10);
        });
    }
    @test.skip "five"() {
        
    }
}

@suite.skip class Skip1 {
    @test one() {}
    @test two() {}
}

@suite(timeout(10))
class TimoutSuite {
    @test fast(done) {
        setTimeout(done, 5);
    }
    @test slow(done) {
        setTimeout(done, 20);
    }
}

@suite class TimeoutSuite2 {
    @test(timeout(20)) fast(done) {
        setTimeout(done, 5);
    }
    @test(timeout(20)) slow(done) {
        setTimeout(done, 20);
    }
}

@suite(skipOnError)
class SequenceOne {
    @test one() {}
    @test two() { throw new Error("Fail!"); }
    @test three() { /* this will skip since two fails */ }
}

@suite(skipOnError)
class SequenceTwo {
    @test one() {}
    @test two() {}
    @test three() {}
}