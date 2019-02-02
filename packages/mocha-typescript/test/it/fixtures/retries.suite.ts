import { assert } from "chai";
import { retries, suite, test } from "../../../src/";

@suite class FlakyMethodDecorator {
    private static runCount1 = 0;
    private static runCount2 = 0;
    private static runCount3 = 0;

    @test @retries(1) public tryOnce() {
        FlakyMethodDecorator.runCount1++;
        assert.isAbove(FlakyMethodDecorator.runCount1, 2);
    }

    @test @retries(2) public tryTwice() {
        FlakyMethodDecorator.runCount2++;
        assert.isAbove(FlakyMethodDecorator.runCount2, 2);
    }

    @test @retries(3) public tryTrice() {
        FlakyMethodDecorator.runCount3++;
        assert.isAbove(FlakyMethodDecorator.runCount3, 2);
    }
}

@suite @retries(3) class FlakySuiteDecorator {
    private static runCount1 = 0;
    private static runCount2 = 0;
    private static runCount3 = 0;

    @test public tryToGetPass2() {
        FlakySuiteDecorator.runCount1++;
        assert.isAbove(FlakySuiteDecorator.runCount1, 2);
    }

    @test public tryToGetPass4() {
        FlakySuiteDecorator.runCount2++;
        assert.isAbove(FlakySuiteDecorator.runCount2, 4);
    }

    @test @retries(4) public overrideSuiteRetries() {
        FlakySuiteDecorator.runCount3++;
        assert.isAbove(FlakySuiteDecorator.runCount3, 4);
    }
}

@suite class FlakyMethodTrait {
    private static runCount1 = 0;
    private static runCount2 = 0;
    private static runCount3 = 0;

    @test(retries(1)) public tryOnce() {
        FlakyMethodTrait.runCount1++;
        assert.isAbove(FlakyMethodTrait.runCount1, 2);
    }

    @test(retries(2)) public tryTwice() {
        FlakyMethodTrait.runCount2++;
        assert.isAbove(FlakyMethodTrait.runCount2, 2);
    }

    @test(retries(3)) public tryTrice() {
        FlakyMethodTrait.runCount3++;
        assert.isAbove(FlakyMethodTrait.runCount3, 2);
    }
}

@suite(retries(3)) class FlakySuiteTrait {
    private static runCount1 = 0;
    private static runCount2 = 0;
    private static runCount3 = 0;

    @test public tryToGetPass2() {
        FlakySuiteTrait.runCount1++;
        assert.isAbove(FlakySuiteTrait.runCount1, 2);
    }

    @test public tryToGetPass4() {
        FlakySuiteTrait.runCount2++;
        assert.isAbove(FlakySuiteTrait.runCount2, 4);
    }

    @test(retries(4)) public overrideSuiteRetries() {
        FlakySuiteTrait.runCount3++;
        assert.isAbove(FlakySuiteTrait.runCount3, 4);
    }
}
