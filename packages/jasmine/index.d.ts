import {
    ExecutionModifierDecorator,
    ExecutionOptionDecorator,
    ParameterisedTestDecorator,
    SuiteDecorator,
    TestDecorator
} from "@testdeck/core";

export const suite: SuiteDecorator;
export const test: TestDecorator;

export const slow: ExecutionOptionDecorator;
export const timeout: ExecutionOptionDecorator;
export const retries: ExecutionOptionDecorator;
export const pending: ExecutionModifierDecorator;
export const only: ExecutionModifierDecorator;
export const skip: ExecutionModifierDecorator;

export const params: ParameterisedTestDecorator;
