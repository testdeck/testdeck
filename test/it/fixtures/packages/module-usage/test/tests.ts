import { IN_TIME, OVERLY_SLOW, TIMEOUT } from '../../../../constants';
import { suite, test, timeout, skipOnError } from "mocha-typescript";

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

@suite(timeout(TIMEOUT))
class TimoutSuite {
    @test fast(done: MochaDone) {
        setTimeout(done, IN_TIME);
    }
    @test slow(done: MochaDone) {
        setTimeout(done, OVERLY_SLOW);
    }
}

@suite class TimeoutSuite2 {
    @test(timeout(TIMEOUT)) fast(done: MochaDone) {
        setTimeout(done, IN_TIME);
    }
    @test(timeout(TIMEOUT)) slow(done: MochaDone) {
        setTimeout(done, OVERLY_SLOW);
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

@suite("named")
class NamedSuite {
    @test("with name")
    testMethod() {
    }
}
