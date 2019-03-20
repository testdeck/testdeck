import { suite, test, timeout, slow, retries } from "./index";
import { METHODS } from "http";

describe("tests", function() {

    @suite class Suite {
        static before() {
        }

        before() {
        }

        @test(timeout(1000), slow(500), retries(3))
        test() {
        }

        @test.pending(timeout(1000)) pendingTest() {
        }

        @test.skip(slow(500)) skippedTest() {
        }

        after() {
        }

        static after() {
        }
    }

    @suite class CallbacksSuite {
        static before(done) {
            done();
        }

        before(done) {
            done();
        }

        
        @test(timeout(1000), slow(500), retries(3))
        test(done) {
            done();
        }

        @test.pending(timeout(1000)) pendingTest(done) {
            done();
        }

        @test.skip(slow(500)) skippedTest(done) {
            done();
        }

        after(done) {
            done();
        }

        static after(done) {
            done();
        }
    }

    @suite.pending class PendintSuite {
        @test test() {
        }
    }

    @suite.skip class SkippedSuite {
        @test test() {
        }
    }

    it("log", function() {
    });
});
