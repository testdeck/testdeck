import { skip, suite, test } from "../src";

@suite
class Suite1 {
    @test
    test1() {
    }

    @test
    @skip
    test2() {
    }

    @test
    @skip(true)
    test3() {
    }

    @test
    @skip(false)
    test4() {
    }
}

@suite
@skip
class Suite2 {
}

@suite
@skip(true)
class Suite3 {
    @test
    test1() {
    }
}

@suite
@skip(false)
class Suite4 {
    @test
    test1() {
    }
}

@suite.skip
class Suite5 {
    @test
    test1() {
    }
}

@suite
class Suite6 {
    @test
    test1() {
    }

    @test.skip
    test2() {
    }
}
