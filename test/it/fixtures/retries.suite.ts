import { assert } from "chai";
import { only, pending, retries, skip, slow, suite, test, timeout } from "../../../index";

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
