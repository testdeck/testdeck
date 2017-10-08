import { suite, test, slow, timeout, skip, only, pending, retries } from "../../index";
import { assert } from "chai";

@suite class FlakyMethodDecorator {
    private static runCount1 = 0;
    private static runCount2 = 0;
    private static runCount3 = 0;

    @test @retries(1) tryOnce() {
        FlakyMethodDecorator.runCount1++;
        assert.isAbove(FlakyMethodDecorator.runCount1, 2);
    }

    @test @retries(2) tryTwice() {
        FlakyMethodDecorator.runCount2++;
        assert.isAbove(FlakyMethodDecorator.runCount2, 2);
    }

    @test @retries(3) tryTrice() {
        FlakyMethodDecorator.runCount3++;
        assert.isAbove(FlakyMethodDecorator.runCount3, 2);
    }
}

@suite @retries(3) class FlakySuiteDecorator {
    private static runCount1 = 0;
    private static runCount2 = 0;
    private static runCount3 = 0;

    @test tryToGetPass2() {
        FlakySuiteDecorator.runCount1++;
        assert.isAbove(FlakySuiteDecorator.runCount1, 2);
    }

    @test tryToGetPass4() {
        FlakySuiteDecorator.runCount2++;
        assert.isAbove(FlakySuiteDecorator.runCount2, 4);
    }

    @test @retries(4) overrideSuiteRetries() {
        FlakySuiteDecorator.runCount3++;
        assert.isAbove(FlakySuiteDecorator.runCount3, 4);
    }
}
