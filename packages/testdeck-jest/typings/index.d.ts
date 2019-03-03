import {
  ClassOrMethodDecorator,
  NumericDecoratorOrTrait,
  ParameterisedTestDecorator,
  SkipDecorator,
  SuiteDecorator,
  SuiteTrait,
  TestDecorator,
  DependencyInjectionSystem
} from "./api";

export const suite: SuiteDecorator;
export const test: TestDecorator;
export const params: ParameterisedTestDecorator;

export const slow: NumericDecoratorOrTrait;
export const timeout: NumericDecoratorOrTrait;
export const retries: NumericDecoratorOrTrait;

export const pending: ClassOrMethodDecorator;
export const only: ClassOrMethodDecorator;
export const skip: SkipDecorator;

export const context: PropertyDecorator;

export const skipOnError: SuiteTrait;

export function registerDI(instantiator: DependencyInjectionSystem): void;
