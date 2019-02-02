import * as Mocha from "mocha";

interface Overload<V extends SuiteTrait | TestTrait, R extends ClassDecorator | MethodDecorator> {
  (name?: string, ... traits: V[]): R;
  (trait: V, ... traits: V[]): R;
}

interface SuiteDecoratorOverload extends Overload<SuiteTrait, ClassDecorator>, ClassDecorator {
}

interface TestDecoratorOverload extends Overload<TestTrait, MethodDecorator>, MethodDecorator {
}

export interface SuiteDecorator extends SuiteDecoratorOverload {
  only: SuiteDecoratorOverload;
  skip: SuiteDecoratorOverload;
  pending: SuiteDecoratorOverload;
}

export interface TestDecorator extends TestDecoratorOverload {
  only: TestDecoratorOverload;
  skip: TestDecoratorOverload;
  pending: TestDecoratorOverload;
}

export interface ParameterisedTestDecorator {
  (params: any, name?: string): MethodDecorator;
  skip(params: any, name?: string): MethodDecorator;
  only(params: any, name?: string): MethodDecorator;
  pending(params: any, name?: string): MethodDecorator;
  naming(nameForParameters: (parameters: any) => string): MethodDecorator;
}

export interface TestFunctions {
  it: Mocha.TestFunction;
  describe: Mocha.SuiteFunction;
  before: Mocha.HookFunction;
  after: Mocha.HookFunction;
  beforeEach: Mocha.HookFunction;
  afterEach: Mocha.HookFunction;
}

export interface SuiteCtor extends Class<SuiteProto> {
  before?: (done?: Mocha.Done) => void;
  after?: (done?: Mocha.Done) => void;
}

export interface SuiteProto extends Prototype {
  before?: (done?: Mocha.Done) => void;
  after?: (done?: Mocha.Done) => void;
}

export type SuiteTrait = (this: Mocha.Suite, ctx: Mocha.Suite, ctor: SuiteCtor) => void;
export type TestTrait = (this: Mocha.Context, ctx: Mocha.Context, instance: SuiteProto, method: Function) => void;

export type NumericDecoratorOrTrait = (time: number) => PropertyDecorator & MethodDecorator & ClassDecorator & SuiteTrait & TestTrait;
export type ClassOrMethodDecorator = () => MethodDecorator | ClassDecorator;

export interface Prototype {
  [key: string]: any;
}

export interface Class<T extends Prototype> {
  new(...args: any[]): T;
  [key: string]: any;
  prototype: T;
}

export interface DependencyInjectionSystem {
  handles<T>(cls: Class<T>): boolean;
  create<T>(cls: Class<T>): T;
}
